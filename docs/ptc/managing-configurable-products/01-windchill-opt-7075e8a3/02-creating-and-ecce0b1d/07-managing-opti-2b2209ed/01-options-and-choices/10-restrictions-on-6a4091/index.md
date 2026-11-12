# Restrictions on Option Names

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsOptionNamesRestrict.html)  
> 获取日期：2026-11-12

<a id="wwID0E2TZQ"></a>

<a id="wwID0ELUZQ"></a>

Options created in Windchill can be passed over to Creo to be used for choice assignments on assembly components and for filtering a configurable product structure to create variants. Option names are managed in Creo as parameters, with the choices reflecting the supported parameter values.

<a id="wwID0EQUZQ"></a>

Option names that can be used in Creo have a number of restrictions that do not exist for option names in Windchill:

<a id="wwID0EJVZQ"></a>

- Option names in Windchill can have both upper and lower case characters; whereas, option names in Creo can have only upper case characters.

<a id="wwID0ELWZQ"></a>

- Option names in Windchill can have spaces; whereas, option names in Creo cannot have spaces.

<a id="wwID0ENXZQ"></a>

- Option names in Windchill can have special characters; whereas, option names in Creo cannot have special characters (except for the underscore “\_”).

<a id="wwID0EPYZQ"></a>

- Option names in Creo are limited to 32 characters in length.

<a id="wwID0ECZZQ"></a>

The following changes are made to the Windchill option names when they are sent to Creo:

<a id="wwID0E2ZZQ"></a>

- Lower-case characters are mapped to upper-case characters.

<a id="wwID0E41ZQ"></a>

- Space characters are mapped to underscore characters.

<a id="wwID0E62ZQ"></a>

- Upper-case characters, numeric characters, and the underscore character are passed as is.

<a id="wwID0ES3ZQ"></a>

After mapping the Windchill option name to the Creo option name, the system issues an error message if any of the following situations occur:

<a id="wwID0EL4ZQ"></a>

- The option name is greater than 32 characters in length.

<a id="wwID0EN5ZQ"></a>

- There are special characters in the Windchill option name that are not supported for the Creo option name.

<a id="wwID0EP6ZQ"></a>

- Mapping the Windchill option name to the Creo option name results in producing a duplicate option name.

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** If an error occurs, the user is instructed to rename the option in Windchill so that it can be passed to Creo. For information on rename, see [Renaming an Option](../09-renaming-an-option/index.md#wwID0EKGZQ "Renaming an Option").
