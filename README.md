# Form Generator

This tool aims to facilitate the construction of JSON Schema for structuring (meta)data.

It implements:
- a simple JSON Schema editor (based on ACE)
- on-the-fly transformation of the schema into a web form using the VJSF library
- a simple JSON instance editor (based on ACE)

All components are reactive: changes in the JSON Schema are directly rendered in the web form, while filled-in values in the form are directly added to the instance (and vice-versa).

The Form Generator is deployed here: https://bytes.kikirpa.be/form-generator

## Path parameters

### The _repo_ and _branch_ parameters

The tool offers a list of pre-selected schemas, pulled from a GitHub resource. By default, it will list the JSON Schemas from the __main__ branch of the __E-RIHS/schema__ repository.
This behaviour can be changed by using the _repo_ and _branch_ parameters.

The _repo_ parameter must consist is {user name|organisation name}/{repository name}. E.g. https://github.com/__E-RIHS/schema__
The _branch_ parameter is the name of a specific branch, a commit number or a tag on Git

Example: the example below will list the JSON Schemas found in https://github.com/E-RIHS/hs-interoperability

```
https://bytes.kikirpa.be/form-generator/?repo=E-RIHS/hs-interoperability
```

### The _url_ parameter

It is possible to pre-load a given schema using the _url_ parameter.
Note: this works independantly from the _repo_ and _branch_ parameters.

Example: the example below will pre-load https://e-rihs.io/schema/service-v0.4.schema.json

```
https://bytes.kikirpa.be/form-generator/?url=https://e-rihs.io/schema/service-v0.4.schema.json
```

### The _s_ and _d_ parameters

The _s_ and _d_ parameters can be used to pre-load respectively a specific JSON schema and an instance dataset. This is particularly useful when developing an new, unsaved schema in a team or to share issues in a dataset.
A shareable url with those _s_ and _d_ parameters will be generated when clicking on the __Share__ button in the navigation bar.
Note: both the schema and the instance are compressed with the Pako javascript library.

### The *data_entry* parameter

While the Form Generator tool is principally created to facilitate the development and evaluation of JSON Schemas, there might be situations where one wants to ask other people to fill in a form to simply collect the form data. In this situation, the JSON Schema editor and Instance editor might undesirable because it distracts the attention of those filling in. By adding the *data_entry* parameter, you can hide the superfluous tabs and the ability to change the schema.

Example: the example below will pre-load https://e-rihs.io/schema/service-v0.4.schema.json, and only the form will be displayed.

```
https://bytes.kikirpa.be/form-generator/?url=https://e-rihs.io/schema/service-v0.4.schema.json&data_entry
```