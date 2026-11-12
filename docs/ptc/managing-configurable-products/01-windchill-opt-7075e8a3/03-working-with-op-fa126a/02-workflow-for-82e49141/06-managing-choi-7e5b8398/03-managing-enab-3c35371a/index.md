# Managing Enable Rules for the Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsSetEnableRuleManage.html)  
> 获取日期：2026-11-12

<a id="wwID0ELPPR"></a>

<a id="wwID0E2PPR"></a>

If the option set was created with **Reference Option Pool Rules Automatically** set to **No**, you can select which global enable rules you want to add to the option set. In addition to the global inherited rules, you can also create local enable rules that are valid only within that option set.

<a id="wwID0ENQPR"></a>

## Reusing Global Rules

<a id="wwID0ERQPR"></a>

To select global enable rules that you want to add to the option set:

<a id="wwID0EKRPR"></a>

1. Go to the information page of the option set and click the **Structure** tab.

<a id="wwID0EQSPR"></a>

2. Select the top node in the tree view table, and click the **Enable Rules** tab in the right pane.

<a id="wwID0EWTPR"></a>

3. On the **Enable Rules** table, click ![](../../../../../../images/95a4c9475784_IconAdd.gif). The **Manage Enable Rule Membership** window opens.

<a id="wwID0EHVPR"></a>

4. The **Candidate Enable Rules** table shows the latest iteration of the latest version the global enable rules. To add enable rules to the option set, select the rows and then click ![](../../../../../../images/95a4c9475784_IconAdd.gif).

<a id="wwID0EUWPR"></a>

5. If you want to remove some enable rules from that table to narrow down the candidate list, select the rows and the click ![](../../../../../../images/ae4a236e741a_IconRemove.gif). The selected enable rules are moved to the **Ignored Enable Rules** table below the **Candidate Enable Rules** table.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/887c9a51d571_tip_16x16.png)** | If in the future you decide to add one of the enable rules from the **Ignored Enable Rules** table to the option set, you can select it and click ![](../../../../../../images/95a4c9475784_IconAdd.gif). |

<a id="wwID0EQZPR"></a>

6. When finished selecting global enable rules, click **Finish**. The global enable rules you selected are added to the **Enable Rules** table.

<a id="wwID0EJQPR-2"></a>

To remove a global enable rule from the option set, select the enable rule in the **Enable Rules** table and click ![](../../../../../../images/ae4a236e741a_IconRemove.gif).

<a id="wwID0EW1PR"></a>

For information on the status of the rules, see [Status of Global Rules](../index.md#wwID0E6ZNR "Managing Choice Rules in the Option Set").

<a id="wwID0EK2PR"></a>

## Creating Local Enable Rules

<a id="wwID0EO2PR"></a>

To create local enable rules:

<a id="wwID0EH3PR"></a>

1. Go to the information page of the option set and select the **Structure** tab.

<a id="wwID0E43PR"></a>

2. Expand items in the tree view in the left pane, and locate the choice that you want to associate with other choices.

<a id="wwID0E54PR"></a>

3. Right-click the choice and select **New Enable Rule** from the actions menu.

<a id="wwID0EE6PR"></a>

4. In the **New Enable Rule** window, provide a description for the enable rule.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | You can display all choices or one group at a time by choosing from the **Group** drop-down list. |

<a id="wwID0EJBQR"></a>

5. Select the target choices. These are the choices that cannot be selected together.

<a id="wwID0ELCQR"></a>

6. Review the selections you have made in the Summary section.

<a id="wwID0ENDQR"></a>

7. Click **OK** to finish. The new enable rule is added to the **Local Enable Rules** table.

<a id="wwID0EHEQR"></a>

To remove a local enable rule, select an enable rule in the **Local Enable Rules** table and click ![](../../../../../../images/ae4a236e741a_IconRemove.gif).

<a id="wwID0EXEQR"></a>

You can edit the local enable rule by right-clicking it, and selecting **Edit** from the actions menu. Editing a rule creates a new iteration of the rule.
