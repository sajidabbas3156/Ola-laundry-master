{pkgs}: {
  deps = [
    pkgs.python311Packages.tldextract
    pkgs.python311Packages.ipyxact
    pkgs.haskellPackages.string-variants
    pkgs.python312Packages.graphite-web
  ];
}
