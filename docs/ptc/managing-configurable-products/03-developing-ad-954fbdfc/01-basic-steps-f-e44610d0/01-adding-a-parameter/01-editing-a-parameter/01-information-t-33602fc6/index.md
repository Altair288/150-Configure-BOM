# Information Tab of the Edit Parameter Window

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsEditParamInfoTab.html)  
> 获取日期：2026-11-12

<a id="wwID0ESX4S"></a>

<a id="wwID0ECY4S"></a>

Define the basic information for the parameter, using the following fields:

| Field | Description |
| --- | --- |
| **Name** | Specifies the name of the parameter. This is a required value. The parameter name must be unique within the configurable module. The following restrictions apply to the parameter name: • The first character is valid in regards to java.lang.Character.isJavaStart( ). • The rest of the characters are valid in regards to java.lang.Character.isJavaIdentifierPart( ). • The name cannot be a Java keyword. For example, public cannot be used as a parameter name. • The name cannot contain spaces. |
| **Description** | (Optional) Provides a description of the parameter. |
| **Map to Attribute** | Represents the attribute to which this parameter is mapped. If the parameter is not mapped to an attribute, this field is blank. |
| **Units** | If the parameter type is defined as Real Number with Units, displays a list of possible unit values. |
| **Type** | Identifies the parameter type. This option is only available if the parameter is not mapped to an attribute. You can select a type or enter a class. The following types are selectable: • Boolean • Date & Time • Real Number • Real Number with Units — Cannot be used for calculations; however, it can be used for input parameters that are mapped to site-defined attributes. • References • URL • Integer Number • String You can also enter names of custom classes that implement methods to convert an instance of the class to a String object and vice versa. The two most common ways to construct the object from a String include providing a constructor or the valueOf() method, both taking a String argument and creating an instance of the class from the String. To convert the object to a String, you can implement the toString() method. Examples of the OOTB implementations of such classes include com.ptc.ddl.util.AngularDimension and com.ptc.ddl.util.RatioObject. All Java wrappers such as java.lang.Short or java.lang.Byte are also supported. |
| **Input Enabled** | Indicates whether input is enabled when configuring the part. Possible values include: • Yes, Required—Users must provide input. • Yes, Not Required—Users are asked to provide input but are not required to. • No—Users are not asked to provide input. |
| **Prompt** | Specifies the phrase that will be displayed for this parameter to help the user understand what the parameter represents. For example, a parameter that represents a set of colors might have a prompt value of "Select the desired color". |
| **Specified By** | Indicates if the parameter is specified by a value or an expression. Possible values include: • Value • Expression |
| **Default Expression** | If the **Specified By** option is set, you can enter a specific value or an expression. If **Specified By** is set to Value, validation is based on the parameter types. If **Specified By** is set to Expression, the expression is validated to ensure the syntax is correct. The Constraint Expression Editor opens in a separate window. |

<a id="wwID0EIQ5S"></a>

For more information on the use of logic in the expression, see [Using Numeric Operators and Functions in Advanced Logic](../../../07-using-numeric-34971aaf/index.md#wwID0E6GGT "Using Numeric Operators and Functions in Advanced Logic").
