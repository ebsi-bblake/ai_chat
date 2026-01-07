{
  description = "AI Chatbot architecture dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forAllSystems = f:
        builtins.listToAttrs (map (system: {
          name = system;
          value = f system;
        }) systems);
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.nodejs_20
              pkgs.git
            ];

            shellHook = ''
              echo "AI Chatbot dev shell"
              echo
              echo "Available commands:"
              echo "  npm test        # run vitest"
              echo "  node demo/server.js"
              echo
            '';
          };
        });
    };
}
