{
  lib,
  stdenv,
  fetchurl,
  autoPatchelfHook,
  libgcc,
  openssl,
}:
stdenv.mkDerivation (finalAttrs: {
  pname = "decky-cli-bin";
  version = "0.0.2";

  src = fetchurl {
    name = "decky-cli-${finalAttrs.version}";
    url = "https://github.com/SteamDeckHomebrew/cli/releases/download/${finalAttrs.version}/decky-linux-x86_64";
    hash = "sha256-nomDValyO9JP06nWm0joSYZ86F757larll0jHqeMXjk=";
  };

  nativeBuildInputs = [autoPatchelfHook];
  buildInputs = [openssl libgcc];

  dontUnpack = true;
  dontConfigure = true;
  dontBuild = true;

  installPhase = ''
    runHook preInstall

    install -Dm 755 $src $out/bin/decky

    runHook postInstall
  '';

  meta = with lib; {
    maintainers = with maintainers; [Scrumplex];
    mainProgram = "decky";
  };
})
