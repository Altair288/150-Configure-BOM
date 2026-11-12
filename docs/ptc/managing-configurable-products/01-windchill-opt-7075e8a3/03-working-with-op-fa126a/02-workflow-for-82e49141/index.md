# Workflow for Defining an Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsSetDefine.html)  
> 获取日期：2026-11-12

<a id="wwID0E1BIR"></a>

<a id="wwID0EKCIR"></a>

To define an option set for a product or library, you first create an option set object and specify its attributes. Then you add option choices to the option set and manage rules in the option set.

<a id="wwID0EPCIR"></a>

The following steps provide an overview of the process:

<a id="wwID0EIDIR"></a>

1. Create an option set as a repository for options and choices, and define its characteristics.

<a id="wwID0EKEIR"></a>

2. Add choices to the option set by referencing options from an option pool.

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | You can include choices from one or several option pools that have been previously created for a product or library. |

<a id="wwID0EHGIR"></a>

3. If the options set is configured to have effectivity, specify effectivity on choices.

<a id="wwID0EJHIR"></a>

4. If the option set supports the ability to individually select global rules, specify which global rules you want to include.

<a id="wwID0ELIIR"></a>

5. If you want to define rules specifically for this option set, create local rules in addition to the global rules.

<a id="wwID0ENJIR"></a>

6. Preview the option set to review all options and choices, including the rules defined among the choices in the option set, that will be available for assignment to parts and their usage, and for filtering the product structure.

<a id="wwID0EPKIR"></a>

7. Test and validate the option set.

<a id="wwID0ERLIR"></a>

8. Release the option set to use.

<a id="wwID0ETMIR"></a>

9. Assign the option set to a configurable product, configurable module, or to a product or library container.
