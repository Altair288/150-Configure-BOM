# Product Family Matrix Editor

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProductFamilyMatrixEditor.html)  
> 获取日期：2026-11-12

<a id="wwID0EYIGU"></a>

<a id="wwID0EJJGU"></a>

The Product Family Matrix Editor is a tool that allows you to view, compare, and define variant specifications in a convenient matrix user interface. You can quickly navigate and view structural breakdown of product models and variant specifications that define a Product Family. You can compare and manage the solutions for these variant specifications in a matrix form.

<a id="wwID0EOJGU"></a>

This information is presented in various panes within the Product Family Matrix Editor. The following table describes these panes.

| Matrix Editor pane | Description |
| --- | --- |
| Product Family | Displays the Product Family structure. To display a variant specification in the module variant table, select it and click **Apply**. |
| Configurable structure table | Displays the configurable module that is associated with the selected variant specifications. Only variant specifications that are derived from same configurable module can be displayed in the Matrix Editor. |
| Module variant table | Indicates whether the part or configurable module in the corresponding row is included in the variant specification shown in the column header. Cell-level actions allow you to manage whether a part or lower-level configurable module is included or excluded from a variant specification, and whether manual or assigned expression filtering is used to determine the variant specification’s components. |
| Details | Contains several tabs with which you can view and manage information about the object you have selected in one of the other panes. For more information on the Details pane, see [Matrix Editor Details Pane](06-matrix-editor-d-82d251/index.md#wwID0EJ5NU "Matrix Editor Details Pane"). |

<a id="wwID0EAPGU"></a>

Table views in these panes can be independently managed using the ![](../../../../images/812898d24ac4_IconCustomize.gif) **Structure views (Default)** action. The **Product Family** and **Details** panes can be collapsed or resized to provide more space for viewing the configurable module and variant specification panes. For more information, see [Matrix Editor Product Family Pane](03-matrix-editor-1a553915/index.md#wwID0E11HU "Matrix Editor Product Family Pane") and [Matrix Editor Configurable Module Table](04-matrix-editor-09b4b09c/index.md#wwID0EPGIU "Matrix Editor Configurable Module Table").

<a id="wwID0EOQGU"></a>

The Matrix Editor allows for manual selection of configurable modules and module variants (parts) that have been selected for a variant specification. For that reason, only managed variant specifications, which can be manually configured through ad hoc selection, can be opened in the Matrix Editor. Variant specifications that were created and defined using the configure process or programmatically cannot be opened in the Product Family Matrix Editor.

<a id="wwID0ETQGU"></a>

To launch the Matrix Editor, use the **Open in Matrix Editor** action that is available from the following locations:

<a id="wwID0EQRGU"></a>

- Right-click actions menu in the Product Family table.

<a id="wwID0ESSGU"></a>

- Product Family **Structure** tab tool bar.

<a id="wwID0EYTGU"></a>

- Right-click actions menu on the Product Family object in the Product Family **Structure** tab.

<a id="wwID0E5UGU"></a>

- Right-click actions menu on the Product Family object in the **Search Results** table.

<a id="wwID0EEWGU"></a>

- The **Actions** menu on a Product Family information page.

<a id="wwID0EKXGU"></a>

- Right-click actions menu on a managed variant specification.

<a id="wwID0EMYGU"></a>

- Right-click actions menu on a variant baseline associated with a managed variant specification.

<a id="wwID0EOZGU"></a>

- The **Actions** menu on the **Variant Baseline** information page and the **Variant Specification** information page.

<a id="wwID0E31GU"></a>

- Tables that display and allow you to select variant baselines and managed variant specifications.

<a id="wwID0E52GU"></a>

- The **Folder Browser** page.

<a id="wwID0EE4GU"></a>

- The **Advanced Search** table.

<a id="wwID0E24GU"></a>

For more information, see [Customizing Product Family Matrix Editor](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/customization/WCCG_BusLogicCust_ProdFamilyCustomizations_LaunchME.html).
