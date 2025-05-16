{
  description = "Discord bot for Prism Launcher";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    pre-commit-hooks = {
      url = "github:cachix/pre-commit-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-utils.follows = "flake-utils";
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    pre-commit-hooks,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      inherit (pkgs) lib;

      decky-cli = pkgs.callPackage ./nix/decky-cli.nix {};
    in {
      checks = {
        pre-commit-check = pre-commit-hooks.lib.${system}.run {
          src = ./.;
          excludes = ["flake.lock" "pnpm-lock.yaml"];
          hooks = {
            alejandra.enable = true;
            prettier.enable = true;
          };
        };
      };
      devShells.default = pkgs.mkShell {
        shellHook = ''
          ${self.checks.${system}.pre-commit-check.shellHook}

          rootDir=$(git rev-parse --show-toplevel)
          mkdir -p $rootDir/cli/
          ln -sf ${lib.getExe decky-cli} $rootDir/cli/decky
        '';
        packages = with pkgs; [nodejs_latest corepack_latest decky-cli];
      };
    });
}
