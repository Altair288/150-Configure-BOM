# Managing Include Rules for the Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsSetMappingsManage.html)  
> 获取日期：2026-11-12

<a id="wwID0EZCOR"></a>

<a id="wwID0EJDOR"></a>

If the option set was created with **Reference Option Pool Rules Automatically** set to **No**, you can select which global include rules you want to add to the option set. In addition to the global inherited rules, you can also create local include rules that are valid only within that option set.

<a id="wwID0E2DOR"></a>

## Reusing Global Rules

<a id="wwID0E6DOR"></a>

To select the global include rules that you want to add to the option set:

<a id="wwID0EYEOR"></a>

1. Go to the information page of the option set and click the **Structure** tab.

<a id="wwID0E5FOR"></a>

2. Select the top node in the tree view and click the **Include Rules** tab in the right pane.

<a id="wwID0EEHOR"></a>

3. On the **Include Rules** table, click ![](../../../../../../images/95a4c9475784_IconAdd.gif). The **Manage Include Rule Membership** window opens.

<a id="wwID0EVIOR"></a>

4. The **Candidate Include Rules** table shows the latest iteration of the latest version of the global include rules. To selectively add the include rules to the option set, select the rows and then click ![](../../../../../../images/95a4c9475784_IconAdd.gif).

<a id="wwID0ECKOR"></a>

5. If you want to remove some include rules from that table to narrow down the candidate list, select the rows to remove from the list and click ![](../../../../../../images/ae4a236e741a_IconRemove.gif). The selected include rules are moved to the **Ignored Include Rules** table below the **Candidate Include Rules** table.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/887c9a51d571_tip_16x16.png)** | If in the future you decide to add one of the include rules from the **Ignored Include Rules** table to the option set, you can select that rule and click ![](../../../../../../images/95a4c9475784_IconAdd.gif). |

<a id="wwID0E5MOR"></a>

6. When finished selecting global include rules, click **Finish**. The global include rules you selected are added to the **Include Rules** table.

<a id="wwID0EXDOR-2"></a>

To remove a global include rule from the option set, select the include rule in the **Include Rules** table and click ![](../../../../../../images/ae4a236e741a_IconRemove.gif).

<a id="wwID0EEOOR"></a>

For information on the status of the rules, see [Status of Global Rules](../index.md#wwID0E6ZNR "Managing Choice Rules in the Option Set").

<a id="wwID0EYOOR"></a>

## Creating Local Include Rules

<a id="wwID0E3OOR"></a>

To create local include rules:

<a id="wwID0EFPOR"></a>

1. Go to the information page of the option set and select the **Structure** tab.

<a id="wwID0EKQOR"></a>

2. Expand items in the tree view in the left pane, and locate the source choice that you want to associate with other choices.

<a id="wwID0EMROR"></a>

3. Right-click the source choice and select **New Include Rule** from the actions menu.

<a id="wwID0ESSOR"></a>

4. In the **New Include Rule** window, provide a description for the include rule.

<a id="wwID0EYTOR"></a>

5. Select the target choices.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | You can display all choices or one group at a time by choosing from the **Group** drop-down list. |

<a id="wwID0EZVOR"></a>

6. Review the selections you made in the Summary section.

<a id="wwID0E2WOR"></a>

7. Click **OK** to finish. The new include rule is added to the **Local Include Rules** table.

<a id="wwID0EVXOR"></a>

To remove a local include rule, select the rule in the **Local Include Rules** table and click ![](../../../../../../images/ae4a236e741a_IconRemove.gif).

<a id="wwID0EFYOR"></a>

You can edit the local include rule by right-clicking it and selecting **Edit**. Editing a rule creates a new iteration of the rule.
