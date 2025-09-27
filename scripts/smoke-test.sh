#!/bin/bash
set -e

# Configuration
BASE_URL="${1:-https://www.olalaundry.com}"
TIMEOUT=10

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    local headers="$4"
    
    echo -n "Testing $name... "
    
    if [ -n "$headers" ]; then
        response=$(curl -s -w "%{http_code}" -m $TIMEOUT -H "$headers" "$url" -o /tmp/response.json)
    else
        response=$(curl -s -w "%{http_code}" -m $TIMEOUT "$url" -o /tmp/response.json)
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL (HTTP $response)${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "=== OLA LAUNDRY MASTER SMOKE TESTS ==="
echo "Testing: $BASE_URL"
echo ""

# 1. Health Check
log_info "1. Health Check"
test_endpoint "Health endpoint" "$BASE_URL/health"

# 2. Frontend Loading
log_info "2. Frontend Loading"
test_endpoint "Homepage" "$BASE_URL/"

# 3. Static Assets
log_info "3. Static Assets"
# Extract CSS file from homepage
CSS_FILE=$(curl -s "$BASE_URL/" | grep -o 'assets/index-[^"]*\.css' | head -1)
if [ -n "$CSS_FILE" ]; then
    test_endpoint "CSS assets" "$BASE_URL/$CSS_FILE"
else
    log_warn "Could not find CSS file in homepage"
    ((TESTS_FAILED++))
fi

# Extract JS file from homepage
JS_FILE=$(curl -s "$BASE_URL/" | grep -o 'assets/index-[^"]*\.js' | head -1)
if [ -n "$JS_FILE" ]; then
    test_endpoint "JS assets" "$BASE_URL/$JS_FILE"
else
    log_warn "Could not find JS file in homepage"
    ((TESTS_FAILED++))
fi

# 4. API Endpoints
log_info "4. API Endpoints"

# Test authentication endpoint
AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@laundrypro.bh","password":"admin123"}' \
    -w "%{http_code}" -o /tmp/auth_response.json)

if [ "$AUTH_RESPONSE" = "200" ]; then
    echo -e "Authentication... ${GREEN}✅ PASS${NC}"
    ((TESTS_PASSED++))
    
    # Extract token for further tests
    AUTH_TOKEN=$(cat /tmp/auth_response.json | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$AUTH_TOKEN" ]; then
        # Test protected endpoints
        test_endpoint "Protected API" "$BASE_URL/api/auth/me" "200" "Authorization: Bearer $AUTH_TOKEN"
        test_endpoint "Dashboard stats" "$BASE_URL/api/dashboard/stats" "200" "Authorization: Bearer $AUTH_TOKEN"
        test_endpoint "AI operations" "$BASE_URL/api/ai/operations" "200" "Authorization: Bearer $AUTH_TOKEN"
        test_endpoint "Financial AI" "$BASE_URL/api/financial/ai-analysis" "200" "Authorization: Bearer $AUTH_TOKEN"
    else
        log_error "Could not extract auth token"
        ((TESTS_FAILED++))
    fi
else
    echo -e "Authentication... ${RED}❌ FAIL (HTTP $AUTH_RESPONSE)${NC}"
    ((TESTS_FAILED++))
    log_warn "Skipping protected endpoint tests due to auth failure"
fi

# 5. Security Headers
log_info "5. Security Headers"
HEADERS=$(curl -s -I "$BASE_URL/" | tr -d '\r')

check_header() {
    local header_name="$1"
    local header_pattern="$2"
    
    if echo "$HEADERS" | grep -qi "$header_pattern"; then
        echo -e "$header_name... ${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "$header_name... ${RED}❌ FAIL${NC}"
        ((TESTS_FAILED++))
    fi
}

check_header "HSTS" "strict-transport-security"
check_header "X-Frame-Options" "x-frame-options"
check_header "X-Content-Type-Options" "x-content-type-options"
check_header "Content-Security-Policy" "content-security-policy"

# 6. SSL/TLS Check
log_info "6. SSL/TLS Check"
if [[ $BASE_URL == https://* ]]; then
    SSL_CHECK=$(echo | openssl s_client -servername $(echo $BASE_URL | sed 's|https://||' | sed 's|/.*||') -connect $(echo $BASE_URL | sed 's|https://||' | sed 's|/.*||'):443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "SSL Certificate... ${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "SSL Certificate... ${RED}❌ FAIL${NC}"
        ((TESTS_FAILED++))
    fi
else
    log_warn "Skipping SSL check for non-HTTPS URL"
fi

# 7. Performance Check
log_info "7. Performance Check"
RESPONSE_TIME=$(curl -w "%{time_total}" -s -o /dev/null "$BASE_URL/")
RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc)

if (( $(echo "$RESPONSE_TIME < 3.0" | bc -l) )); then
    echo -e "Response time (${RESPONSE_TIME_MS%.*}ms)... ${GREEN}✅ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "Response time (${RESPONSE_TIME_MS%.*}ms)... ${YELLOW}⚠️ SLOW${NC}"
    ((TESTS_FAILED++))
fi

# Results Summary
echo ""
echo "=== SMOKE TEST RESULTS ==="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED - READY FOR PRODUCTION${NC}"
    exit 0
else
    echo -e "\n${RED}❌ SOME TESTS FAILED - REVIEW BEFORE PRODUCTION${NC}"
    exit 1
fi