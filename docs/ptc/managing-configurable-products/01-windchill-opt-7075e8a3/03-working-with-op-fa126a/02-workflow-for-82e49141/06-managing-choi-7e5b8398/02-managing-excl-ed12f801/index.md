# Managing Exclude Rules for the Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsSetConstraintManage.html)  
> 获取日期：2026-11-12

<a id="wwID0ECZOR"></a>

<a id="wwID0ESZOR"></a>

If the option set was created with **Reference Option Pool Rules Automatically** set to **No**, you can select which global exclude rules you want to add to the option set. In addition to the global inherited rules, you can also create local exclude rules that are valid only within that option set.

<a id="wwID0EE1OR"></a>

## Reusing Global Rules

<a id="wwID0EI1OR"></a>

To select global exclude rules that you want to add to the option set:

<a id="wwID0EB2OR"></a>

1. Go to the information page of the option set and click the **Structure** tab.

<a id="wwID0EH3OR"></a>

2. Select the top node in the tree view table, and click the **Exclude Rules** tab in the right pane.

<a id="wwID0EN4OR"></a>

3. On the **Exclude Rules** table, click ![](../../../../../../images/95a4c9475784_IconAdd.gif). The **Manage Exclude Rule Membership** window opens.

<a id="wwID0E55OR"></a>

4. The **Candidate Exclude Rules** table shows the latest iteration of the latest version the global exclude rules. To add exclude rules to the option set, select the rows and then click ![](../../../../../../images/95a4c9475784_IconAdd.gif).

<a id="wwID0ELAPR"></a>

5. If you want to remove some exclude rules from that table to narrow down the candidate list, select the rows and the click ![](../../../../../../images/ae4a236e741a_IconRemove.gif). The selected exclude rules are moved to the **Ignored Exclude Rules** table below the **Candidate Exclude Rules** table.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/887c9a51d571_tip_16x16.png)** | If in the future you decide to add one of the rules from the **Ignored Exclude Rules** table to the option set, you can select it and click ![](../../../../../../images/95a4c9475784_IconAdd.gif). |

<a id="wwID0EHDPR"></a>

6. When finished selecting global exclude rules, click **Finish**. The global exclude rules you selected are added to the **Exclude Rules** table.

<a id="wwID0EA1OR-2"></a>

To remove a global include rule from the option set, select the include rule in the **Exclude Rules** table and click ![](../../../../../../images/ae4a236e741a_IconRemove.gif).

<a id="wwID0ENEPR"></a>

For information on the status of the rules, see [Status of Global Rules](../index.md#wwID0E6ZNR "Managing Choice Rules in the Option Set").

<a id="wwID0EBFPR"></a>

## Creating Local Exclude Rules

<a id="wwID0EFFPR"></a>

To create local exclude rules:

<a id="wwID0E5FPR"></a>

1. Go to the information page of the option set and select the **Structure** tab.

<a id="wwID0EUGPR"></a>

2. Expand items in the tree view in the left pane, and locate the choice that you want to associate with other choices.

<a id="wwID0EVHPR"></a>

3. Right-click the choice and select **New Exclude Rule** from the actions menu.

<a id="wwID0E2IPR"></a>

4. In the **New Exclude Rule** window, provide a description for the exclude rule.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | You can display all choices or one group at a time by choosing from the **Group** drop-down list. |

<a id="wwID0EALPR"></a>

5. Select the target choices. These are the choices that cannot be selected together.

<a id="wwID0ECMPR"></a>

6. Review the selections you have made in the Summary section.

<a id="wwID0EENPR"></a>

7. Click **OK** to finish. The new exclude rule is added to the **Local Exclude Rules** table.

<a id="wwID0E5NPR"></a>

To remove a local exclude rule, select an exclude rule in the **Local Exclude Rules** table and click ![](../../../../../../images/ae4a236e741a_IconRemove.gif).

<a id="wwID0EOOPR"></a>

You can edit the local exclude rule by right-clicking it, and selecting **Edit** from the actions menu. Editing a rule creates a new iteration of the rule.
