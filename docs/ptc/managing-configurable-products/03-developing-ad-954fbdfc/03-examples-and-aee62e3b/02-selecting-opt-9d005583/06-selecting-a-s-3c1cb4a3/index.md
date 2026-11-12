# Selecting a Single Option from a Rapidly Changing Set of Options

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVSelSglOptFrmRapChgOpts.html)  
> 获取日期：2026-11-12

<a id="wwID0E6WLT"></a>

<a id="wwID0EQXLT"></a>

In some cases, you may want to select a single option from a set of possible options, but the set of possible options is extremely large or changes rapidly. For example, you may want to add a company logo or name to a product that you are customizing for a particular environment. In this case, you may not know which company logo files exist in the system at any given time. You only know the company logo file that each product configuration needs.

<a id="wwID0EVXLT"></a>

The technique used in this approach relies on the variant matching capabilities, allowing you to automatically find and reuse the right company logo file.

<a id="wwID0E1XLT"></a>

To select a single option from a rapidly changing set of options:

<a id="wwID0ETYLT"></a>

1. Using the **Type and Attribute Management** utility, create a string attribute such as Company Name.

<a id="wwID0EZZLT"></a>

2. Assign this attribute to every part or part soft-type within Windchill that contains a company logo file.

<a id="wwID0EG2LT"></a>

3. For each part that contains a company logo, ensure that the string attribute has an appropriate value. For example, the file PTC\_logo.jpg might have a Company Name attribute with a value of PTC.

<a id="wwID0EI3LT"></a>

4. Create a configurable module that represents the product or product portion uses the logo file.

<a id="wwID0EK4LT"></a>

5. Add a string input parameter to the configurable module; for example, askName:

<a id="wwID0ET5LT"></a>

- Define an appropriate prompt value for the string parameter such as: Enter the Company Name for this product

<a id="wwID0EY6LT"></a>

- Ensure that this parameter is mapped to the string attribute. For example, Company Name.

<a id="wwID0E2AMT"></a>

6. Ensure that each part that contains a company logo is attached as a variant to the configurable module that represents the product or product portion.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** To view a variant, go to the information page of the configurable module, open a new tab and click **Customize**, and then select Related Objects > Variants.

<a id="wwID0E5CMT"></a>

Although the product structure does not show any of these possible options, the variant part with the matching Company Name attribute is automatically identified and included in the variant product structure when the user requests deliverables for their variant specification.
