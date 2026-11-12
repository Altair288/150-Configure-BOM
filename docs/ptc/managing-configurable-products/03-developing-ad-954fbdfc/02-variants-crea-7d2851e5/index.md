# Variants Created From Configurable Modules With Advanced Selection Logic

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsVariantsCreate.html)  
> 获取日期：2026-11-12

<a id="wwID0EGSHT"></a>

<a id="wwID0EWSHT"></a>

A module variant represents a part structure created from a configurable module structure. To create a module variant from a configurable module, you must use the Configure process to specify the necessary input values, define a variant specification, and then generate a deliverable.

<a id="wwID0E6SHT"></a>

## Creating Module Variants for Structures with Configurable Modules with No Children

<a id="wwID0EDTHT"></a>

You can enable the creation of module variants for structures that include configurable modules with no children (also referred to as leaf nodes). To do that, a site administrator must set the preference Leaf Node Generation in the Options and Variants Preferences group to yes. The default is no. This preference can be set for a site, organization, or product or library.

<a id="wwID0EZTHT"></a>

## Creating Module Variants of a Specified Subtype

<a id="wwID0E4THT"></a>

You can create module variants that use a specified subtype, which is different from that of the configurable module from which the variant is generated. To enable this capability, a site administrator must specify the subtype for the variant using the Variant Subtype preference in the Options and Variants Preferences group. The value for the preference is the internal name for the subtype, for example, WCTYPE|wt.part.WTPart|org.eng.BikePart.

<a id="wwID0EKUHT"></a>

If the preference is not set, the system uses the type of the configurable module for the variant creation. This preference can be set for a site, organization, product, or library.

<a id="wwID0ETUHT"></a>

## Using a Parameter for Generating the Variant Name

<a id="wwID0EXUHT"></a>

You can specify a parameter that will be used to name module variants of a configurable module based on the values of the parameters that are used to generate the variant.

<a id="wwID0E2UHT"></a>

To set up the rules for generating the variant name:

<a id="wwID0EUVHT"></a>

1. For a configurable module, add a new parameter, for example VariantName.

<a id="wwID0E1WHT"></a>

2. Specify its type as **String**.

<a id="wwID0EAYHT"></a>

3. Enter a value or a Java expression to drive the variant name. An expression may include a combination of the key parameters that are used to characterize the variant. For example, in the **Default Expression** field, specify this expression to control the name of the variant:

<a id="wwID0EVYHT"></a>

"Variant" + length + "inches, " + color + "color"

<a id="wwID0EAYHT-5"></a>

1. where length and color are the parameters defined for this variant.

<a id="wwID0EWZHT"></a>

4. Click the **User Interface** tab and set the value for the variant name property to yes.

<a id="wwID0EE2HT"></a>

5. When generating a variant, the system substitutes the parameters used in the expression by the selected parameter values. For example, the variant name can be Variant 12 inches, blue color.

<a id="wwID0E12HT"></a>

Consider this information for setting up rules for variants names:

<a id="wwID0ET3HT"></a>

- The parameter name must be String.

<a id="wwID0EV4HT"></a>

- The parameter must have a value assigned in the saved variant specification.

<a id="wwID0EX5HT"></a>

- If multiple parameters are used to drive the variant name, the system uses the first one listed.

<a id="wwID0EZ6HT"></a>

- The variant name must be within 60 characters.
