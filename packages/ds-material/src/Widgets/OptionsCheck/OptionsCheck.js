import React from 'react';
import {
    FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox,
} from '@material-ui/core';
import {Map, List} from 'immutable';
import {TransTitle, Trans, beautifyKey, extractValue, memo} from '@ui-schema/ui-schema';
import {useUID} from 'react-uid';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';
import {sortScalarList} from '@ui-schema/ui-schema/Utils/sortScalarList';

const OptionCheck = ({currentValue, label, onChange}) => {
    const uid = useUID();

    return <FormControlLabel
        id={'uis-' + uid}
        control={<Checkbox
            id={'uis-' + uid}
            value={currentValue}
            checked={currentValue}
            onChange={onChange}
        />}
        label={label}
    />;
};

const checkActive = (list, name) => list && list.contains && typeof list.contains(name) !== 'undefined' ? list.contains(name) : false;

const OptionsCheckValue = extractValue(memo(({
                                                 enumVal, storeKeys, value, onChange, trans, tt,
                                                 required, type,
                                             }) =>
    enumVal ?
        enumVal.map((enum_name) => {
            const isActive = checkActive(value, enum_name)

            const relativeT = List(['enum', enum_name]);

            return <OptionCheck
                key={enum_name}
                currentValue={isActive}
                onChange={() => {
                    onChange(
                        storeKeys, ['value'],
                        ({value: val = List()}) =>
                            ({
                                value: sortScalarList(checkActive(val, enum_name) ?
                                    val.delete(val.indexOf(enum_name)) :
                                    val.push(enum_name)),
                            }),
                        required,
                        type,
                    )
                }}
                label={<Trans
                    schema={trans}
                    text={storeKeys.insert(0, 'widget').concat(relativeT).join('.')}
                    context={Map({'relative': relativeT})}
                    fallback={beautifyKey(enum_name, tt)}
                />}
            />
        }).valueSeq()
        : null,
));

const OptionsCheck = ({
                          ownKey, schema, storeKeys, showValidity, valid, required, errors,
                          row,
                      }) => {
    const enumVal = schema.get('enum');
    if(!enumVal) return null;

    return <FormControl required={required} error={!valid && showValidity} component="fieldset">
        <FormLabel component="legend">
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        </FormLabel>
        <FormGroup row={row}>
            <OptionsCheckValue enumVal={enumVal} storeKeys={storeKeys} trans={schema.get('t')} tt={schema.get('tt')} required={required} type={schema.get('type')}/>
        </FormGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>;
};

export {OptionsCheck};
