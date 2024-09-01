{
  inputs.utils.url = "github:numtide/flake-utils";
  outputs = {
    self,
    nixpkgs,
    utils,
  }:
    utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [
          (final: prev: {nodejs = prev.nodejs_22;})
        ];
      };
    in {
      devShells.default = pkgs.mkShell rec {
        packages = with pkgs; [
          nodejs
          nodePackages.pnpm
        ];

        shellHook = ''
          echo -e "Entering dev shell for $(basename "$(pwd)")...\n"

          echo "Installed nix packages:"
          for path in ${builtins.concatStringsSep " " packages}; do
            pkg=$(basename "$path" | awk -F '-' '{print substr($0, index($0, $2))}')
            echo -e "\t$pkg"
          done
        '';
      };
    });
}
