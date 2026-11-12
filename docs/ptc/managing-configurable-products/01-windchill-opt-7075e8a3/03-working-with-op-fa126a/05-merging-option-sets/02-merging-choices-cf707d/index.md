# Merging Choices and Rules

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsMergeChoicesRules.html)  
> 获取日期：2026-11-12

<a id="wwID0EVIUR"></a>

<a id="wwID0EJJUR"></a>

The **Merge Option Sets** action merges the option sets assigned to lower-level products with the option set assigned to a top-level product. The action also merges the local rules assigned to the lower-level option sets with the top-level option set. So, you must ensure that the local rules defined for the lower-level option sets are valid for the top-level option set.

<a id="wwID0ESJUR"></a>

To merge the option sets, use the following procedure:

<a id="wwID0ELKUR"></a>

1. On the part information page of a top-level product, click Actions > Merge Option Sets.

<a id="wwID0ENLUR"></a>

1. The **CONFIRM: Merge Option Sets** window displays the options sets that will be merged.

<a id="wwID0EHMUR"></a>

2. Verify the option sets, and click **OK**.

<a id="wwID0E3MUR"></a>

1. A confirmation message appears.

<a id="wwID0EGNUR"></a>

You can verify the merge action using any of the following methods:

<a id="wwID0E6NUR"></a>

- On the **Details** and **Attributes** tabs under the **Structure** tab of a top-level product’s option set, the **Merged** attribute is set to **Yes**.

<a id="wwID0EVPUR"></a>

- On the **Structure** and **Design Option** tabs of the option set, and on the **Design Choice** tab of the option, a Merged icon ![](../../../../../images/a0b21ed5ab9a_MergeIcon.png) is displayed against each merged option or choice.

<a id="wwID0ELRUR"></a>

- The Merged icon is also displayed against each merged rule on the **Conditional Rules**, **Include Rules**, **Exclude Rules**, and **Enable Rules** tabs under the **Structure** tab of the top-level product’s option set.

<a id="wwID0EBTUR"></a>

- Merged icons are displayed in the option set table column for the options that are merged. However, you need to [customize the table view](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/usersetup_personal/UserSetupTableViewNew.html) to display the column. After customizing, you can view the merged icons using any of the following methods:

<a id="wwID0EQUUR"></a>

- On the **Structure** tab of the top-level product’s part information page, click **Edit Filter**, and then click the **Option Filter** tab in the **Edit Filter** window.

<a id="wwID0ECWUR"></a>

- On the top-level product’s part information page, click Actions > Configure, and then click the **Option Filter** tab under **Set Filter** in the **Configure** window.

<a id="wwID0EBYUR"></a>

- On the **Structure** tab of the top-level product’s option set, on the toolbar, click **Preview**.

<a id="wwID0ELZUR"></a>

- On the **Structure** tab of the **Variant Specification** page, click Actions > Preview. This page appears only after you [configure a variant specification](../../../08-creating-and-a9cfd907/02-creating-vari-da7dff17/index.md#wwID0EPGOS "Creating Variant Structures Using the Configure Process").

<a id="wwID0EO2UR"></a>

- In the **New Include Rule**, **New Exclude Rule**, and **New Enable Rule** windows that appear when you are creating a new rule. For more information on creating a new include, exclude, or enable rule, see [Managing Choice Rules in the Option Set](../../02-workflow-for-82e49141/06-managing-choi-7e5b8398/index.md#wwID0EEQNR "Managing Choice Rules in the Option Set").

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** • Option Manager can also move groups or options and choices for merged option sets. Option set allows for reordering of groups, options and choices of merged option sets.• You cannot modify or remove the merged choices and rules or assign expressions to the merged choices that were added from a lower-level option set. To do so, you need to remove the merged choices from the merged option set. For more information, see [Removing Merged Choices and Rules](../03-removing-merg-b3cafce6/index.md#wwID0E2EVR "Removing Merged Choices and Rules").• You cannot sort the column displaying the Merged icons.• You can import or export the merged option sets using the [Import/Export Management](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/exportimport/ExportImportAbout.html) utility or using the [Export](../../04-exporting-and-afbb0f3f/index.md#wwID0E21SR "Exporting and Importing an Option Set") option on the **Actions** menu on the option set information page. However, while importing, ensure that you set the **Import action** as **Default**. Other import actions are not supported. Additionally, you can use the command line loader to import the merged option sets.
