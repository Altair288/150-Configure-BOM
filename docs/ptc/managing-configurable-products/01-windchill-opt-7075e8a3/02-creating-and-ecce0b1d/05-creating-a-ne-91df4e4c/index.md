# Creating a New Option Subtype

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsNewSoftTypeCreate.html)  
> 获取日期：2026-11-12

<a id="wwID0ENUSQ"></a>

<a id="wwID0E4USQ"></a>

In addition to the out-of-the-box subtypes (Sales and Design) for the Option and Choice objects, a Site Administrator can create new subtypes.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Additional user-created subtypes can only be peers to the out-of-the-box subtypes, such as Design Option or Sales Option. You cannot create an hierarchy of subtypes nesting them under the out-of-the-box subtypes.

<a id="wwID0ERWSQ"></a>

1. Log in as a Site Administrator and go to Utilities > Type and Attribute Management. Click the **Manage Types** tab.

<a id="wwID0EHYSQ"></a>

2. Create a new Choice subtype. Locate the Choice type, right-click it, and select **New Subtype**. In the **New Subtype** window, define the new subtype.

<a id="wwID0ERZSQ"></a>

3. To make this new subtype available from the user interface, select **Yes** for **Instantiable**.

<a id="wwID0E21SQ"></a>

4. Select **No** for **Subtypeable**.

<a id="wwID0EF3SQ"></a>

5. Creating a choice subtype automatically creates an associated new Option subtype.

<a id="wwID0EH4SQ"></a>

6. Locate the new Options subtype, right-click it and **Edit**.

<a id="wwID0EN5SQ"></a>

7. To make this new subtype available from the user interface, select **Yes** for **Instantiable**.

<a id="wwID0EX6SQ"></a>

8. Select **No** for **Subtypeable**.

<a id="wwID0EBBTQ"></a>

9. To test the new subtype, go to the option pool user interface and verify that you can successfully create new subtypes of options and choices.

<a id="wwID0EUBTQ"></a>

For more in-depth information on using the **Type and Attribute Management** utility, go to [About the Type and Attribute Manager](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/typeattr/TypeMgrAbout.html).
