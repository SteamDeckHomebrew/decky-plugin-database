from os import path
import subprocess
import re
import decky_plugin
import logging
from settings import SettingsManager


logging.basicConfig(filename=decky_plugin.DECKY_PLUGIN_LOG_DIR + "/python.log",
                    format="[NordVPNDeck] %(asctime)s %(levelname)s %(message)s",
                    filemode="w+",
                    force=True)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

class SettingsManagerExtended(SettingsManager):
    def __init__(self, name: str, settings_directory: str | None = None) -> None:
        super().__init__(name, settings_directory)

    def settingExists(self, key: str) -> bool:
        return key in self.settings


settings = SettingsManagerExtended(name="settings",settings_directory=decky_plugin.DECKY_PLUGIN_SETTINGS_DIR)
settings.read()


class Plugin:
    async def isInstalled(self):
        try:
            str(subprocess.run(["nordvpn"], capture_output=True, text=True).stdout)
            logger.info("Is installed: True")
            return True
        except Exception:
            logger.info("Is installed: False")
            return False

    async def getVersion(self):
        subprocess.run(["nordvpn", "version"], capture_output=True, text=True).stdout
        ver = re.search(r"\d+(\.\d+)+", str(subprocess.run(["nordvpn", "version"], capture_output=True, text=True).stdout)).group()
        logger.info("Returned version: " + ver)
        return ver

    async def getCountries(self):
        logger.info("Get countries returned: " + str(subprocess.run(["nordvpn", "countries"], capture_output=True, text=True).stdout).replace("-", "").replace("\n", "").replace("    ", ""))
        return str(subprocess.run(["nordvpn", "countries"], capture_output=True, text=True).stdout).replace("-", "").replace("\n", "").replace("    ", "")

    async def getCities(self, country):
        logger.info("Get cities returned: " + str(subprocess.run(["nordvpn", "cities", country], capture_output=True, text=True).stdout).replace("-", "").replace("\n", "").replace("    ", ""))
        return str(subprocess.run(["nordvpn", "cities", country], capture_output=True, text=True).stdout).replace("-", "").replace("\n", "").replace("    ", "")

    async def isConnected(self):
        logger.info("Is connected: " + (not str(subprocess.run(["nordvpn", "status"], capture_output=True, text=True).stdout).__contains__("Disconnected")))
        return not str(subprocess.run(["nordvpn", "status"], capture_output=True, text=True).stdout).__contains__("Disconnected")
        
    async def disconnect(self):
        logger.info("Disconnecting")
        str(subprocess.run(["nordvpn", "disconnect"], capture_output=True, text=True).stdout)

    async def autoConnect(self):
        logger.info("Autoconnecting")
        str(subprocess.run(["nordvpn", "connect"], capture_output=True, text=True).stdout)

    async def connect(self, countryName, cityName):
        logger.info("Connecting to server in: " + countryName + " " + cityName)
        subprocess.run(["nordvpn", "connect", countryName, cityName], capture_output=True, text=True)

    async def getSetting(self, name): 
        for line in str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("\n"):
            if line.split(": ")[0].__contains__(name):
                return line.split(": ")[1].__contains__("enabled")
        return ""
        
    def getFirewall(self):
        for line in str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("\n"):
            if line.split(": ")[0].__contains__("Firewall"):
                return line.split(": ")[1].__contains__("enabled")
        return ""

    async def getRouting(self):
        for line in str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("\n"):
            if line.split(": ")[0].__contains__("Routing"):
                return line.split(": ")[1].__contains__("enabled")
        return ""

    async def getAnalytics(self):
        for line in str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("\n"):
            if line.split(": ")[0].__contains__("Analytics"):
                return line.split(": ")[1].__contains__("enabled")
        return ""

    async def getKillSwitch(self):
        for line in str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("\n"):
            if line.split(": ")[0].__contains__("Kill Switch"):
                return line.split(": ")[1].__contains__("enabled")
        return ""

    async def getThreatProtectionLite(self):
        for line in str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("\n"):
            if line.split(": ")[0].__contains__("Threat Protection Lite"):
                return line.split(": ")[1].__contains__("enabled")
        return ""

    async def getNotify(self):
        for line in str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("\n"):
            if line.split(": ")[0].__contains__("Notify"):
                return line.split(": ")[1].__contains__("enabled")
        return ""

    async def getAutoConnect(self):
        for line in str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("\n"):
            if line.split(": ")[0].__contains__("Auto-connect"):
                return line.split(": ")[1].__contains__("enabled")
        return ""

    async def getIPv6(self):
        for line in str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("\n"):
            if line.split(": ")[0].__contains__("IPv6"):
                return line.split(": ")[1].__contains__("enabled")
        return ""

    async def getLanDiscovery(self):
        for line in str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("\n"):
            if line.split(": ")[0].__contains__("LAN Discovery"):
                return line.split(": ")[1].__contains__("enabled")
        return ""

    async def setFirewall(self, state):
        str(subprocess.run(["nordvpn", "set", "firewall", str(state)], capture_output=True, text=True).stdout)

    async def setRouting(self, state):
        str(subprocess.run(["nordvpn", "set", "routing", str(state)], capture_output=True, text=True).stdout)

    async def setAnalytics(self, state):
        str(subprocess.run(["nordvpn", "set", "analytics", str(state)], capture_output=True, text=True).stdout)

    async def setKillSwitch(self, state):
        str(subprocess.run(["nordvpn", "set", "killswitch", str(state)], capture_output=True, text=True).stdout)

    async def setThreatProtectionLite(self, state):
        str(subprocess.run(["nordvpn", "set", "threatprotectionlite", str(state)], capture_output=True, text=True).stdout)

    async def setNotify(self, state):
        str(subprocess.run(["nordvpn", "set", "notify", str(state)], capture_output=True, text=True).stdout)

    async def setAutoConnect(self, state):
        str(subprocess.run(["nordvpn", "set", "autoconnect", str(state)], capture_output=True, text=True).stdout)

    async def setIPv6(self, state):
        str(subprocess.run(["nordvpn", "set", "ipv6", str(state)], capture_output=True, text=True).stdout)

    async def setLanDiscovery(self, state):
        str(subprocess.run(["nordvpn", "set", "lan-discovery", str(state)], capture_output=True, text=True).stdout)

    async def resetDefaults(self):
        logger.info("Resetting to defaults")
        str(subprocess.run(["nordvpn", "set", "defaults"], capture_output=True, text=True).stdout)

    async def isLoggedIn(self):
        logger.info("Called isLogin")
        return str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout).__contains__("VPN Service")
    
    async def login(self):
        return str(subprocess.run(["nordvpn", "login"], text=True, capture_output=True).stdout).replace("\n", "").split("browser: ")[1]
    
    async def logout(self):
        try:
            str(subprocess.run(["nordvpn", "logout"], capture_output=True, text=True).stdout)
            logger.info("Logging out succeeded")
            return True
        except subprocess.CalledProcessError:
            logger.info("Logging out failed")
            return False

    async def getEmail(self):
        logger.info("Returning email: " + re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout)).group())
        return re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout)).group()

    async def isSubscriptionActive(self):
        logger.info("Is subscription active: " + str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout).__contains__("VPN Service: Active"))
        return str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout).__contains__("VPN Service: Active")

    async def getSubscriptionExpireDate(self):
        logger.info("Returned expire info: " + str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout).split("Expires on ")[1].replace(")", ""))
        return str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout).split("Expires on ")[1].replace(")", "")  
    
    async def getConnection(self):
        output = str(subprocess.run(["nordvpn", "status"], capture_output=True, text=True).stdout).split("Status")[1]
        if(output.__contains__("Disconnected")):
            return {
                "Status": "ui.connectioninfo.disconnected",
                "Hostname": "N/A",
                "IP": "N/A",
                "Country": "N/A",
                "City": "N/A",
                "CurrentTechnology": "N/A",
                "CurrentProtocol": "N/A",
                "Transfer": "N/A",
                "Uptime": "N/A"
            }
        else:
            output = ("Status" + output).split("\n")
            return {
                "Status": "ui.connectioninfo.connected",
                "Hostname": output[1].split(": ")[1],
                "IP": output[2].split(": ")[1],
                "Country": output[3].split(": ")[1],
                "City": output[4].split(": ")[1],
                "CurrentTechnology": output[5].split(": ")[1],
                "CurrentProtocol": output[6].split(": ")[1],
                "Transfer": output[7].split(": ")[1],
                "Uptime": output[8].split(": ")[1]
            }
        
    async def loginCallback(self, url: str):
        return str(subprocess.run(["nordvpn", "login", "--callback", url], capture_output=True, text=True).stdout)
          
    async def settings_read(self):
        return settings.read()
    
    async def settings_commit(self):
        return settings.commit()

    async def settings_getSetting(self, key: str, defaults):
        return settings.getSetting(key, defaults)
    
    async def settings_setSetting(self, key: str, value):
        return settings.setSetting(key, value)
    
    async def settings_settingExists(self, key: str):
        return settings.settingExists(key)