import React from 'react';
import {
    FormControl, Grid, FormLabel, IconButton, Typography, Divider,
} from '@material-ui/core';
import {Add, Delete, KeyboardArrowUp, KeyboardArrowDown} from '@material-ui/icons';
import {UIGeneratorNested, TransTitle, extractValue, memo, storeMoveItem, updateValue} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';
import {List, Map} from 'immutable';
import {AccessTooltipIcon} from '../../Component/Tooltip/Tooltip';

let GenericListItem = ({index, listSize, listNoSelf, itemsSchema, showValidity, onChange, storeKeys, btnSize}) => {
    const ownKeys = storeKeys.push(index)
    return <React.Fragment>
        <Grid item xs={12} style={{display: 'flex'}}>
            <Grid container spacing={2} wrap={'nowrap'}>
                <Grid item style={{display: 'flex', flexDirection: 'column', flexShrink: 0}}>

                    {index > 0 ? <IconButton
                        size={btnSize} style={{margin: '0 auto'}}
                        onClick={storeMoveItem(onChange, ownKeys, -1)}>
                        <AccessTooltipIcon title={`Move to ${(index + 1) - 1}. position`}>
                            <KeyboardArrowUp fontSize={'inherit'}/>
                        </AccessTooltipIcon>
                    </IconButton> : null}

                    <Typography
                        component={'p'} variant={'caption'} align={'center'}
                        aria-label={'Item Number'} style={{margin: '6px 0', minWidth: '2rem'}}>
                        {index + 1}.
                    </Typography>

                    {index < listSize - 1 ? <IconButton
                        size={btnSize} style={{margin: '0 auto'}}
                        onClick={storeMoveItem(onChange, ownKeys, 1)}>
                        <AccessTooltipIcon title={`Move to ${(index + 1) + 1}. position`}>
                            <KeyboardArrowDown fontSize={'inherit'}/>
                        </AccessTooltipIcon>
                    </IconButton> : null}

                </Grid>


                {List.isList(itemsSchema) ?
                    <Grid item style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                        <Grid container spacing={2}>
                            {itemsSchema.map((item, j) => <UIGeneratorNested
                                key={j}
                                showValidity={showValidity}
                                storeKeys={ownKeys.push(j)}
                                schema={item}
                            />).valueSeq()}
                        </Grid>
                    </Grid> :
                    <UIGeneratorNested
                        showValidity={showValidity}
                        storeKeys={ownKeys}
                        schema={itemsSchema}
                    />}

                <Grid item style={{display: 'flex', flexShrink: 0}}>
                    <IconButton
                        onClick={() => {
                            onChange(updateValue(storeKeys, listNoSelf))
                        }}
                        size={btnSize}
                        style={{margin: '0 0 auto 0'}}
                    >
                        <AccessTooltipIcon title={'Delete Item'}>
                            <Delete fontSize={'inherit'}/>
                        </AccessTooltipIcon>
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
        {index < listSize - 1 ? <Divider style={{width: '100%'}}/> : null}
    </React.Fragment>
}
GenericListItem = memo(GenericListItem)


const GenericList = extractValue(memo(({
                                           storeKeys, ownKey, schema, value: list, onChange,
                                           showValidity, valid, errors, required,
                                       }) => {
    const btnSize = schema.getIn(['view', 'btnSize']) || 'small';

    return <FormControl required={required} error={!valid && showValidity} component="fieldset" style={{width: '100%'}}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormLabel component="legend"><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></FormLabel>
            </Grid>

            {list ? list.map((val, i) =>
                <GenericListItem
                    key={i} index={i} listSize={list.size} listNoSelf={list.splice(i, 1)}
                    btnSize={btnSize} storeKeys={storeKeys}
                    itemsSchema={schema.get('items')} onChange={onChange}
                />,
            ).valueSeq() : null}

            <Grid item xs={12}>
                <IconButton
                    onClick={() => {
                        onChange(updateValue(
                            storeKeys, list ?
                                list.push(List.isList(schema.get('items')) ? List() : Map()) :
                                List([List.isList(schema.get('items')) ? List() : Map()]),
                            required, schema.get('type'),
                        ))
                    }}
                    size={btnSize}
                >
                    <AccessTooltipIcon title={'New Item'}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton>

                <ValidityHelperText
                    /*
                     * only pass down errors which are not for a specific sub-schema
                     * todo: check if all needed are passed down
                     */
                    errors={errors}
                    showValidity={showValidity}
                    schema={schema}
                />
            </Grid>
        </Grid>
    </FormControl>
}));

export {GenericList};
