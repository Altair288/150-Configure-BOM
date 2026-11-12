# Adding a Child Resolution

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/ExpChildResolutionAdd.html)  
> 获取日期：2026-11-12

<a id="wwID0EB2AT"></a>

<a id="wwID0EV2AT"></a>

A child resolution is used to reorder the sequence of the input parameters. Rather than processing all of the input parameters in the parent first, followed by each child, the system interrupts the processing of the parent's input parameters and processes the input parameters for the child.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** It is not possible to use a child resolution more than once.

<a id="wwID0EP3AT"></a>

To specify a resolution of a child configurable module:

<a id="wwID0EX3AT"></a>

1. Select the configurable module for which you want to define a child resolution from the **Structure** pane in Part Structure Browser.

<a id="wwID0EM4AT"></a>

2. Click the **Parameters** tab from the left pane. The **Parameters** pane displays a table with a row for each parameter and columns that define the information presented about each parameter.

<a id="wwID0EF5AT"></a>

3. Select the parameter for which you want to define a child resolution.

<a id="wwID0EW5AT"></a>

4. Click the insert child resolution icon ![](../../../../../images/9410297caf43_IconInsert.gif). The **Add Child Resolution** window appears, displaying the name and number of all available child configurable modules.

<a id="wwID0ES6AT"></a>

5. Select the child configurable module for which you want to add a resolution.

<a id="wwID0EDABT"></a>

6. Click **OK** to insert the child resolution for the selected child configurable module. The part configuration process will require completion of the child configurable module’s inputs before proceeding to the selection of the parent configurable module’s inputs.

<a id="wwID0EYABT"></a>

A row is added to the table, with an icon and the text **Child Resolution**. The configurable module to be resolved is displayed in the Expression/Value column.
