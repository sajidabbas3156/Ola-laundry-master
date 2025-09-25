
import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// OLAORDERS LAUNDRY W.L.L. Financial AI Assistant
interface LaundryFinancials {
  revenue: number;
  cogs: number;
  grossProfit: number;
  netProfit: number;
  kilosProcessed: number;
  averagePrice: number;
}

interface LaundryKPIs {
  waterUsage: number; // L/kg
  energyUsage: number; // kWh/kg
  detergentCost: number; // BHD/kg
  packagingCost: number; // BHD/kg
  grossMargin: number; // percentage
}

interface LaundryTargets {
  year: number;
  monthlyKilos: number;
  annualKilos: number;
  waterTarget: number;
  energyTarget: number;
  grossMarginTarget: number;
}

// Pricing constants for OLAORDERS LAUNDRY W.L.L.
const PRICING = {
  washOnly: 1.0, // BHD/kg
  washIron: 1.3, // BHD/kg
  minimumKg: 4,
  minimumCharge: 4.0 // BHD (4kg × 1.0 BHD)
};

// Current KPI targets
const KPI_TARGETS: LaundryTargets[] = [
  { year: 1, monthlyKilos: 1800, annualKilos: 21600, waterTarget: 4.0, energyTarget: 0.6, grossMarginTarget: 65 },
  { year: 2, monthlyKilos: 2400, annualKilos: 28800, waterTarget: 3.8, energyTarget: 0.55, grossMarginTarget: 65 },
  { year: 3, monthlyKilos: 2800, annualKilos: 33600, waterTarget: 3.5, energyTarget: 0.5, grossMarginTarget: 65 }
];

// Calculate order pricing
function calculateOrderPrice(kilos: number, serviceType: 'wash' | 'wash_iron'): number {
  const pricePerKg = serviceType === 'wash_iron' ? PRICING.washIron : PRICING.washOnly;
  const totalPrice = kilos * pricePerKg;
  
  // Apply minimum charge if below 4kg
  return Math.max(totalPrice, PRICING.minimumCharge);
}

// Financial calculations
function calculateFinancials(orders: any[]): LaundryFinancials {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalKilos = orders.reduce((sum, order) => sum + order.kilos, 0);
  const cogs = totalRevenue * 0.35; // 35% COGS
  const grossProfit = totalRevenue - cogs;
  
  // Simplified net profit calculation
  const opex = totalRevenue * 0.25; // Estimated OPEX
  const depreciation = 41.67; // 500 BHD annually / 12 months
  const netProfit = grossProfit - opex - depreciation;

  return {
    revenue: totalRevenue,
    cogs,
    grossProfit,
    netProfit,
    kilosProcessed: totalKilos,
    averagePrice: totalKilos > 0 ? totalRevenue / totalKilos : 0
  };
}

// KPI tracking
function calculateKPIs(kilosProcessed: number, waterUsed: number, energyUsed: number): LaundryKPIs {
  return {
    waterUsage: kilosProcessed > 0 ? waterUsed / kilosProcessed : 0,
    energyUsage: kilosProcessed > 0 ? energyUsed / kilosProcessed : 0,
    detergentCost: 0.08, // Fixed cost per kg
    packagingCost: 0.04, // Current packaging cost per kg
    grossMargin: 0 // Will be calculated from financials
  };
}

// Main AI Financial Dashboard
router.get("/api/laundry-ai/financial-dashboard", async (req: Request, res: Response) => {
  try {
    const { period = 'current_month' } = req.query;
    
    // Mock data - replace with actual database queries
    const mockOrders = [
      { id: 1, kilos: 5.5, serviceType: 'wash_iron', total: calculateOrderPrice(5.5, 'wash_iron') },
      { id: 2, kilos: 3.2, serviceType: 'wash', total: calculateOrderPrice(3.2, 'wash') },
      { id: 3, kilos: 8.0, serviceType: 'wash', total: calculateOrderPrice(8.0, 'wash') },
      { id: 4, kilos: 12.5, serviceType: 'wash_iron', total: calculateOrderPrice(12.5, 'wash_iron') }
    ];

    const financials = calculateFinancials(mockOrders);
    const currentKPIs = calculateKPIs(financials.kilosProcessed, 115, 17.4); // Mock usage data
    const currentYear = 1; // This would come from business logic
    const targets = KPI_TARGETS[currentYear - 1];

    // Calculate gross margin
    currentKPIs.grossMargin = (financials.grossProfit / financials.revenue) * 100;

    // Sensitivity analysis
    const volumeUp10 = calculateFinancials(mockOrders.map(o => ({...o, kilos: o.kilos * 1.1, total: o.total * 1.1})));
    const volumeDown10 = calculateFinancials(mockOrders.map(o => ({...o, kilos: o.kilos * 0.9, total: o.total * 0.9})));

    // Alerts and recommendations
    const alerts = [];
    const recommendations = [];

    if (currentKPIs.waterUsage > targets.waterTarget) {
      alerts.push({
        type: 'warning',
        message: `Water usage (${currentKPIs.waterUsage.toFixed(2)} L/kg) exceeds target (${targets.waterTarget} L/kg)`,
        impact: 'cost_increase'
      });
      recommendations.push('Optimize water recycling system and check for leaks');
    }

    if (currentKPIs.grossMargin < targets.grossMarginTarget) {
      alerts.push({
        type: 'critical',
        message: `Gross margin (${currentKPIs.grossMargin.toFixed(1)}%) below target (${targets.grossMarginTarget}%)`,
        impact: 'profitability_risk'
      });
      recommendations.push('Review pricing strategy or reduce COGS through supplier negotiations');
    }

    if (financials.kilosProcessed < targets.monthlyKilos * 0.8) {
      alerts.push({
        type: 'info',
        message: `Monthly volume (${financials.kilosProcessed} kg) tracking below target (${targets.monthlyKilos} kg)`,
        impact: 'revenue_shortfall'
      });
      recommendations.push('Increase marketing efforts and customer acquisition campaigns');
    }

    res.json({
      success: true,
      data: {
        business_info: {
          company: "OLAORDERS LAUNDRY W.L.L.",
          location: "Bahrain",
          mission: "Sustainable, technology-enabled laundry solutions"
        },
        financials: {
          revenue: `${financials.revenue.toFixed(2)} BHD`,
          cogs: `${financials.cogs.toFixed(2)} BHD`,
          gross_profit: `${financials.grossProfit.toFixed(2)} BHD`,
          net_profit: `${financials.netProfit.toFixed(2)} BHD`,
          kilos_processed: `${financials.kilosProcessed.toFixed(1)} kg`,
          average_price: `${financials.averagePrice.toFixed(2)} BHD/kg`
        },
        kpis: {
          water_usage: `${currentKPIs.waterUsage.toFixed(2)} L/kg`,
          energy_usage: `${currentKPIs.energyUsage.toFixed(2)} kWh/kg`,
          detergent_cost: `${currentKPIs.detergentCost.toFixed(2)} BHD/kg`,
          packaging_cost: `${currentKPIs.packagingCost.toFixed(2)} BHD/kg`,
          gross_margin: `${currentKPIs.grossMargin.toFixed(1)}%`
        },
        targets: {
          year: targets.year,
          monthly_target: `${targets.monthlyKilos} kg`,
          annual_target: `${targets.annualKilos} kg`,
          water_target: `${targets.waterTarget} L/kg`,
          energy_target: `${targets.energyTarget} kWh/kg`,
          margin_target: `${targets.grossMarginTarget}%`
        },
        sensitivity_analysis: {
          volume_up_10_percent: {
            revenue_impact: `${(volumeUp10.revenue - financials.revenue).toFixed(2)} BHD`,
            profit_impact: `${(volumeUp10.netProfit - financials.netProfit).toFixed(2)} BHD`
          },
          volume_down_10_percent: {
            revenue_impact: `${(volumeDown10.revenue - financials.revenue).toFixed(2)} BHD`,
            profit_impact: `${(volumeDown10.netProfit - financials.netProfit).toFixed(2)} BHD`
          }
        },
        alerts,
        recommendations,
        pricing_model: {
          wash_only: `${PRICING.washOnly} BHD/kg`,
          wash_iron: `${PRICING.washIron} BHD/kg`,
          minimum_order: `${PRICING.minimumKg} kg`,
          minimum_charge: `${PRICING.minimumCharge} BHD`
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Financial dashboard generation failed" });
  }
});

// Order pricing calculator
router.post("/api/laundry-ai/calculate-order", async (req: Request, res: Response) => {
  try {
    const { kilos, serviceType = 'wash' } = req.body;
    
    if (!kilos || kilos <= 0) {
      return res.status(400).json({ error: "Invalid kilos amount" });
    }

    const price = calculateOrderPrice(kilos, serviceType);
    const isMinimumCharge = kilos < PRICING.minimumKg;
    
    res.json({
      success: true,
      order: {
        kilos,
        service_type: serviceType,
        price_per_kg: serviceType === 'wash_iron' ? PRICING.washIron : PRICING.washOnly,
        calculated_price: (kilos * (serviceType === 'wash_iron' ? PRICING.washIron : PRICING.washOnly)).toFixed(2),
        final_price: price.toFixed(2),
        minimum_charge_applied: isMinimumCharge,
        currency: "BHD"
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Order calculation failed" });
  }
});

// Real-time KPI monitoring
router.get("/api/laundry-ai/kpi-monitoring", async (req: Request, res: Response) => {
  try {
    const currentKPIs = calculateKPIs(29.2, 115, 17.4); // Mock current data
    const targets = KPI_TARGETS[0]; // Year 1 targets
    
    const kpiStatus = {
      water_usage: {
        current: currentKPIs.waterUsage.toFixed(2),
        target: targets.waterTarget,
        status: currentKPIs.waterUsage <= targets.waterTarget ? 'on_track' : 'needs_attention',
        variance: ((currentKPIs.waterUsage / targets.waterTarget - 1) * 100).toFixed(1)
      },
      energy_usage: {
        current: currentKPIs.energyUsage.toFixed(2),
        target: targets.energyTarget,
        status: currentKPIs.energyUsage <= targets.energyTarget ? 'on_track' : 'needs_attention',
        variance: ((currentKPIs.energyUsage / targets.energyTarget - 1) * 100).toFixed(1)
      },
      sustainability_score: {
        water_efficiency: currentKPIs.waterUsage <= targets.waterTarget ? 100 : Math.max(0, 100 - (currentKPIs.waterUsage / targets.waterTarget - 1) * 100),
        energy_efficiency: currentKPIs.energyUsage <= targets.energyTarget ? 100 : Math.max(0, 100 - (currentKPIs.energyUsage / targets.energyTarget - 1) * 100),
        overall_score: 0
      }
    };
    
    kpiStatus.sustainability_score.overall_score = (
      kpiStatus.sustainability_score.water_efficiency + 
      kpiStatus.sustainability_score.energy_efficiency
    ) / 2;

    res.json({
      success: true,
      kpi_monitoring: kpiStatus,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: "KPI monitoring failed" });
  }
});

// Volume impact simulation
router.post("/api/laundry-ai/simulate-volume-impact", async (req: Request, res: Response) => {
  try {
    const { volumeChange = 10, currentKilos = 1800 } = req.body;
    
    const newVolume = currentKilos * (1 + volumeChange / 100);
    const currentRevenue = currentKilos * 1.15; // Average price estimate
    const newRevenue = newVolume * 1.15;
    
    const currentProfit = currentRevenue * 0.4; // Simplified profit calculation
    const newProfit = newRevenue * 0.4;
    
    const profitImpact = ((newProfit / currentProfit - 1) * 100);
    
    res.json({
      success: true,
      simulation: {
        volume_change: `${volumeChange}%`,
        current_volume: `${currentKilos} kg/month`,
        projected_volume: `${newVolume.toFixed(0)} kg/month`,
        revenue_impact: `${((newRevenue / currentRevenue - 1) * 100).toFixed(1)}%`,
        profit_impact: `${profitImpact.toFixed(1)}%`,
        absolute_profit_change: `${(newProfit - currentProfit).toFixed(2)} BHD`,
        recommendation: profitImpact > 15 ? 'High impact - prioritize volume growth' : 
                       profitImpact < -15 ? 'High risk - implement cost controls' : 
                       'Moderate impact - maintain current strategy'
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Volume simulation failed" });
  }
});

export default router;
