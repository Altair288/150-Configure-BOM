# Setting the Preference for Displaying Choices

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsChoiceDisplayFormatPreference.html)  
> 获取日期：2026-11-12

<a id="wwID0ER24Q"></a>

<a id="wwID0EB34Q"></a>

You can use a preference **Choice Display Format** to specify how numeric and non-numeric choices appear in the user interfaces and expressions that reference them. This is a preference available to both users and administrators. Users can set the choice display format for the products and libraries to which they have access.

<a id="wwID0EL34Q"></a>

The format set by this preference determines how the attributes of a choice appear in the user interfaces for:

<a id="wwID0EE44Q"></a>

- Specifying choice filtering criteria

<a id="wwID0EG54Q"></a>

- Creating include, exclude, and enable rules

<a id="wwID0EI64Q"></a>

- Creating basic assigned expressions

<a id="wwID0EKA5Q"></a>

- Populating option sets with choices

<a id="wwID0EMB5Q"></a>

- Configuring product module

<a id="wwID0E6B5Q"></a>

Specifically, for this option you can set:

<a id="wwID0EYC5Q"></a>

- **Non-numeric Choice Format** – The preference value describes the format for displaying the attributes of a choice. To specify the value for the preference, you list the attributes that you want to show (Name, Number, Description), including the delimiters to separate the attributes: (,;:) and the characters to group the attributes: ()\{\}\[\].

<a id="wwID0EMD5Q"></a>

- For example, you can choose the following formats: (Number, Name: Description) or \{\[Number :Name\],(Description)\}.

<a id="wwID0EKE5Q"></a>

- **Numeric Choice Format**–The preference value describes the format for displaying the attributes of a choice. To specify the value for the preference, you list the attributes that you want to show (Name, Number, Description, and Value), including the delimiters to separate the attributes: (,;:) and the characters to group the attributes: ()\{\}\[\].

<a id="wwID0E5E5Q"></a>

- For example, you can specify the following format: \{(Name : Value), Description\} or \[Number : Value\],(Description).

<a id="wwID0E4F5Q"></a>

- **Rule and Expression Format** – Select **Name** or **Number** to specify how the attributes of a choice appear in the user interfaces for:

<a id="wwID0ENH5Q"></a>

- Creating and editing advanced assigned expressions, aliases, and conditional rules

<a id="wwID0EPI5Q"></a>

- Showing the logic for choice rules and assigned expressions
