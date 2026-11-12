# Managing Conditional Rules for the Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsManagCondRules.html)  
> 获取日期：2026-11-12

<a id="wwID0EVFQR"></a>

<a id="wwID0EFGQR"></a>

If the option set was created with the **Reference Option Pool Rules Automatically** attribute set to **No**, you can select which global conditional rules you want to add to the option set. In addition to the global inherited rules, you can also create local conditional rules that are valid only within that option set.

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** If at least one choice from the IF and THEN portions of a conditional rule belongs to the option set, then that conditional rule is inherited from the option pool if **Reference Option Pool Rules Automatically** is set to **Yes**.

<a id="wwID0E2HQR"></a>

## Reusing Global Rules

<a id="wwID0E6HQR"></a>

To select the global conditional rules that you want to add to the option set:

<a id="wwID0EYIQR"></a>

1. Go to the information page of the option set and click the **Structure** tab.

<a id="wwID0E5JQR"></a>

2. Select the top node in the tree view and click the **Conditional Rules** tab in the right pane.

<a id="wwID0EELQR"></a>

3. On the **Conditional Rules** table, click ![](../../../../../../images/95a4c9475784_IconAdd.gif). The **Manage Conditional Rule Membership** window opens.

<a id="wwID0EVMQR"></a>

4. The **Candidate Conditional Rules** table shows the latest iteration of the latest version of the global conditional rules. To selectively add the conditional rules to the option set, select the rows and then click ![](../../../../../../images/95a4c9475784_IconAdd.gif).

<a id="wwID0EDOQR"></a>

5. If you want to remove some conditional rules from that table to narrow down the candidate list, select the rows to remove from the list and click ![](../../../../../../images/ae4a236e741a_IconRemove.gif). The selected conditional rules are moved to the **Ignored Conditional Rules** table below the **Candidate Conditional Rules** table.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/887c9a51d571_tip_16x16.png)** | If in the future you decide to add one of the conditional rules from the **Ignored Conditional Rules** table to the option set, you can select that rule and click ![](../../../../../../images/95a4c9475784_IconAdd.gif). |

<a id="wwID0E6QQR"></a>

6. When finished selecting global conditional rules, click **Finish**. The global conditional rules you selected are added to the **Conditional Rules** table.

<a id="wwID0EXHQR-2"></a>

To remove a global conditional rule from the option set, select the conditional rule in the **Conditional Rules** table and click ![](../../../../../../images/ae4a236e741a_IconRemove.gif).

<a id="wwID0EFSQR"></a>

For information on the status of the rules, see [Status of Global Rules](../index.md#wwID0E6ZNR "Managing Choice Rules in the Option Set").

<a id="wwID0EZSQR"></a>

## Creating Local Conditional Rules

<a id="wwID0E4SQR"></a>

To create local conditional rules:

<a id="wwID0EWTQR"></a>

1. Go to the information page of the option set and select the **Structure** tab.

<a id="wwID0E3UQR"></a>

2. Go to the **Conditional Rules** tab.

<a id="wwID0ECWQR"></a>

3. Click ![](../../../../../../images/1672457aff60_IconChoiceRulesNew.gif).

<a id="wwID0ELXQR"></a>

4. The **New Conditional Rule** window opens. Provide the description for the rule.

<a id="wwID0ERYQR"></a>

5. Enter an expression in the **If** section of the window. You can add multiple expressions by adding rows to the table. Click ![](../../../../../../images/95a4c9475784_IconAdd.gif) to add more rows. Expressions in each row are combined using the OR operator.

<a id="wwID0E5ZQR"></a>

6. In the **Then** section of the window, select the appropriate action:

<a id="wwID0EH2QR"></a>

- **Disable** – If the expressions in the IF section are evaluated to TRUE, then disable the choices listed in the THEN section.

<a id="wwID0EM3QR"></a>

- **Enable**– If the expressions in the IF section are evaluated to TRUE, then enable the choices listed in the THEN section.

<a id="wwID0ER4QR"></a>

- **Include** – If the expressions in the IF section are evaluated to TRUE, then include the choices listed in the THEN section.

<a id="wwID0EX5QR"></a>

7. In the **Then** section, enter the choices that are the target of the selected action.

<a id="wwID0E46QR"></a>

8. Click **Finish**.

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** When creating a conditional rule on an Option Pool or an Option Set using a boolean option, you cannot specify the boolean choice directly. Instead, specify the boolean option name or number based on the preference **Choice Display Format**, and the negation character for the “No” choice as specified in the ato.negation.operator property.

<a id="wwID0EXBRR"></a>

To remove a local conditional rule, select a conditional rule in the **Local Rules** table and click ![](../../../../../../images/ae4a236e741a_IconRemove.gif).

<a id="wwID0EHCRR"></a>

You can edit the local conditional rule by right-clicking it, and selecting **Edit** from the actions menu. Editing a rule creates a new iteration of the rule.
