# Renaming an Option

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsOptionRename.html)  
> 获取日期：2026-11-12

<a id="wwID0EKGZQ"></a>

<a id="wwID0E1GZQ"></a>

You can rename an option after it was created.

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Occasionally, you may need to rename a Windchill option to comply with the naming restrictions in Creo (if options are also used in Creo for configuring CAD structures). For information on the naming restrictions, see [Restrictions on Option Names](../10-restrictions-on-6a4091/index.md#wwID0E2TZQ "Restrictions on Option Names").

<a id="wwID0EFIZQ"></a>

The **Rename** action is available from the following locations:

<a id="wwID0ECJZQ"></a>

- From the right-click menu when selecting an option in the tree view (left pane) on the **Option Pool** tab

<a id="wwID0EIKZQ"></a>

- From the right-click menu when selecting an option in the **Options** table (right pane) on the **Option Pool** tab

<a id="wwID0ESLZQ"></a>

- From the **Actions** drop-down list on the option information page

<a id="wwID0ENMZQ"></a>

## Resolving Rename Conflicts

<a id="wwID0ERMZQ"></a>

If you attempt to rename an option that has an external reference from a logic parameter used in a configurable module or if an option is associated with checked out CAD documents, the system issues an error message and prevents you from renaming the option.

<a id="wwID0EVMZQ"></a>

To resolve a conflict when an option is used in checked out CAD documents (or in newly created CAD documents that have been uploaded but not checked in), check in the CAD documents into Windchill first, and then rename the option.

<a id="wwID0EZMZQ"></a>

To resolve a conflict when an option is used in a logic reference:

<a id="wwID0ESNZQ"></a>

1. In the Part Structure Browser, open the configurable module that references this option.

<a id="wwID0EVOZQ"></a>

2. Edit the advanced selection logic to remove the logic reference.

<a id="wwID0EXPZQ"></a>

3. Repeat steps 1 and 2 for other configurable modules that use this logic reference.

<a id="wwID0EZQZQ"></a>

4. Rename the option as needed.

<a id="wwID0E2RZQ"></a>

5. Recreate the logic references using the renamed option.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/887c9a51d571_tip_16x16.png)** | If an option or choice is renamed and if that option or choice is associated with a CAD document that was downloaded in a workspace when the rename occurred, that CAD document shows the old name. You can see the new option or choice name by removing and then re-adding the CAD document from the workspace. |
