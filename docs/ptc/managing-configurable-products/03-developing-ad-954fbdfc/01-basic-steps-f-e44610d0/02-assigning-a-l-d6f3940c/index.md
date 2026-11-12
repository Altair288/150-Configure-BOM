# Assigning a Logic Reference to Another Configurable Module

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsRefOptionSets.html)  
> 获取日期：2026-11-12

<a id="wwID0E5NBT"></a>

<a id="wwID0EOOBT"></a>

You can reuse the logic and parameter selection defined in one configurable module that is external to a part structure, to a part inside the structure. To do this, you need to create a logic reference from a part in the structure to the external part. Once a logic reference is created, you can constrain certain parameters to obtain their values from the configurable module that is identified as a logic reference.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** If you need to reference parameters from a configurable module within the same part structure, you must use either equivalencies or external parameter references. For more information, see [Passing Parameter Values between Sections of a Product Structure Using Equivalencies](../../03-examples-and-aee62e3b/04-creating-modu-dcf516dc/02-passing-param-5a1fc489/index.md#wwID0E54QT "Passing Parameter Values between Sections of a Product Structure Using Equivalencies") and [Passing Parameter Values between Sections of a Product Structure Using Reference IDs](../../03-examples-and-aee62e3b/04-creating-modu-dcf516dc/03-passing-param-def5dbfb/index.md#wwID0ECMRT "Passing Parameter Values between Sections of a Product Structure Using Reference IDs"). You can use the logic reference technique only if you want to reference a parameter from a part that is external to the structure.

<a id="wwID0EIQBT"></a>

Referencing a configurable module follows these rules:

<a id="wwID0EBRBT"></a>

- A configurable module can reference multiple configurable modules.

<a id="wwID0EDSBT"></a>

- Within a configurable structure, configurable modules can reference different configurable modules.

<a id="wwID0EWSBT"></a>

To create a logic reference:

<a id="wwID0EPTBT"></a>

1. Go to the information page of a configurable module.

<a id="wwID0ERUBT"></a>

2. Show the **Logic References** table by adding a new tab and selecting Customize > General > Logic References.

<a id="wwID0ENWBT"></a>

3. Click the add icon ![](../../../../images/95a4c9475784_IconAdd.gif).

<a id="wwID0EWXBT"></a>

4. In the **Logic References** window, specify the object type from the **Type** list.

<a id="wwID0EAZBT"></a>

5. Type the part name and number, or click **Search**.

<a id="wwID0EG1BT"></a>

6. From the search results, select the part to reference.

<a id="wwID0EI2BT"></a>

7. Type the name for the reference in the **Reference** field, and click **OK**.

<a id="wwID0ES3BT"></a>

8. The new logic reference is added to the **Logic References** table, and the part is checked back in. The reference points to a specific version of the configurable module.
