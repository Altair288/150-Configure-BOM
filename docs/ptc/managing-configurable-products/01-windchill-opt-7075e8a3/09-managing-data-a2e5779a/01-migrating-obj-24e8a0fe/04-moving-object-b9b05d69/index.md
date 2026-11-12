# Moving Objects Using WinDU and WinRU

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsWinduWinru.html)  
> 获取日期：2026-11-12

<a id="wwID0EF4XS"></a>

<a id="wwID0EV4XS"></a>

For target system, after an upgrade has been performed, the Site or Organization Administrator can move the migrated option sets (formerly known as Navigation Filter Template) and associated options and choices to the appropriate contexts using WinDU and WinRU tools.

<a id="wwID0E14XS"></a>

The WinDU diagnostic task “OptionSet listing of objects at the site and organization levels” reports all OptionSet objects that belong to organizations and sites, which need to be moved to appropriate product or library contexts.

<a id="wwID0E64XS"></a>

WinDU can be launched using the script named windu located in the $(wt.home)\\bin directory.

<a id="wwID0EA6XS"></a>

- On Windows, use the script $(wt.home)\\bin\\windu.bat

<a id="wwID0EFAYS"></a>

- On UNIX, use the script $(wt.home)/bin/windu.sh

<a id="wwID0E2AYS"></a>

These scripts must be run from a GUI shell running on the Windchill installation's host.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** These scripts cannot be run from a remote client.

<a id="wwID0E2BYS"></a>

Follow these steps to perform an automatic migration:

<a id="wwID0EUCYS"></a>

1. Start running the WinDU script.

<a id="wwID0EWDYS"></a>

2. A Swing application opens. Select the diagnostic tasks that you want to run or deselect the ones that you do not want to run using the checkboxes next to the names of the diagnostic tasks. In this case, select the “OptionSet listing of objects at the site and organization levels” task.

<a id="wwID0EHEYS"></a>

![](../../../../../images/7a042bcd4075_WinduWinru1.png)

<a id="wwID0EUEYS"></a>

![](../../../../../images/ffc524c83396_WinduWinru2.png)

<a id="wwID0ESFYS"></a>

3. Select **Run**. WinDU attempts to confirm that the web server and servlet engines are running.

<a id="wwID0EYGYS"></a>

4. You are prompted to log into the Windchill instance as an administrator. Once you have succeeded, the diagnostic tasks start running in sequence.

<a id="wwID0EJHYS"></a>

![](../../../../../images/42011a79ee7d_WinduWinru3.png)

<a id="wwID0EHIYS"></a>

5. After the diagnostic tasks are complete, WinDU informs you if any of the diagnostic tasks produced logged output and provides paths to the log files.

<a id="wwID0EYIYS"></a>

![](../../../../../images/bf76f636e93b_WinduWinru4.png)

<a id="wwID0EWJYS"></a>

6. The output of the WinDU task is XML in $(wt.home)\\loadXMLFiles\\OptionSetContainerMappings.xml.

<a id="wwID0ELKYS"></a>

1. For example, assume that there is an option set in Windchill source system called “Bicycle Option Set Template” in “Demo Organization” OrgContainer. The OptionSetContainerMappings.xml is created, containing the option set name and its context.

<a id="wwID0EPKYS"></a>

<?xml version='1.0' encoding='UTF-8'?><br><OptionSetContainerMappings><br><mapping><br><optionset>Bicycle Option Set Template</optionset><br><container>/wt.inf.container.OrgContainer=Demo Organization</container><br></mapping><br></OptionSetContainerMappings>

<a id="wwID0EUKYS"></a>

1. You must manually update the OptionSetContainerMappings.xml context information to specify to which context this particular option set should be moved. In the example below, the context must be updated to /wt.inf.container.OrgContainer=Demo Organization/wt.pdmlink.PDMLinkProduct=Bicycle. This moves the option set to the Bicycle product context.

<a id="wwID0EBLYS"></a>

<?xml version='1.0' encoding='UTF-8'?><br><OptionSetContainerMappings><br><mapping><br><optionset>Bicycle Option Set Template</optionset><br><container>/wt.inf.container.OrgContainer=Demo Organization/wt.pdmlink.PDMLinkProduct=Bicycle</container><br></mapping><br></OptionSetContainerMappings>

<a id="wwID0EXLYS"></a>

7. A WinRU task has been created to read the updated OptionSetContainerMappings.xml and perform the move option set action. Similarly to WinDU, WinRU can be launched using the script named winru located in the $(wt.home)\\bin directory.

<a id="wwID0EQMYS"></a>

1. On Windows, run the script $(wt.home)\\bin\\winru.bat.

<a id="wwID0EZMYS"></a>

1. On Unix, run the script $(wt.home)/bin/winru.sh.

<a id="wwID0ECNYS"></a>

![](../../../../../images/10ea3b59925d_WinduWinru5.png)

<a id="wwID0EAOYS"></a>

8. From the list, select **Move Site and Organization OptionSet to Product and Library containers** using the check boxes next to the name of the repair tasks. Click Run to start the repair task.

<a id="wwID0EGPYS"></a>

9. Once the repair task is complete, WinRU informs you if the repair task produced any logged output, and provide paths to the log files.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | You can run WinRU for a given task only once. If you need to repeat the process, you must first restore the database to be able to run the task again. |

<a id="wwID0ETQYS"></a>

![](../../../../../images/855c4532dfa8_WinduWinru6.png)
