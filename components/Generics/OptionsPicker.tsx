import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { TopicType } from '../../types';
import { Switch, Text } from 'react-native';
import styles from '../../Styles/styles';

export enum optionKeys { 'orgAcronym', 'groupAcronym', 'assetUid' }
type HomeProps = {
    setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
    options: TopicType[];
    _label: string;
    valueType: optionKeys;
    compareValue?: string | null;
}


export default function OptionsPicker({ _label, options, setSelectedValue, valueType, compareValue }: HomeProps) {
    const [selectedOptions, setSelectedOptions] = useState<string>();
    const [optionsToshow, setOptionsToShow] = useState<TopicType[]>([]);
    const [filtered, setFiltered] = useState<boolean>(false);
    useEffect(() => {
        if (options.length > 0) {
            findDifferentOptions();
        }
    }, [options, compareValue])

    const findDifferentOptions = () => {
        setOptionsToShow([]);
        let lastOption: TopicType | null = null;
        let localOptions: TopicType[] = [];
        switch (valueType) {

            case optionKeys.groupAcronym:
                options.forEach(element => {
                    if (lastOption == null && element.orgAcronym == compareValue || lastOption?.groupAcronym != element.groupAcronym && element.orgAcronym == compareValue) {
                        localOptions.push(element);
                        lastOption = element;
                    }
                });
                break;
            case optionKeys.orgAcronym:
                options.forEach(element => {
                    if (lastOption == null || lastOption.orgAcronym != element.orgAcronym) {
                        localOptions.push(element);
                        lastOption = element;
                    }
                });
                break;
            case optionKeys.assetUid:
                options.forEach(element => {
                    if (lastOption == null && element.orgAcronym == compareValue || lastOption?.assetUid != element.assetUid && element.groupAcronym == compareValue) {
                        localOptions.push(element);
                        lastOption = element;
                    }
                });
                break;
        }
        setOptionsToShow(localOptions);
        setFiltered(true);

    }


    useEffect(() => {
        setSelectedOptions(_label);
    }, [_label])


    function returnPicker(keyName: number) {
        if (filtered) {
            switch (valueType) {

                case optionKeys.groupAcronym:
                    return (
                        <Picker.Item key={keyName} label={optionsToshow[keyName].groupAcronym} value={optionsToshow[keyName].groupAcronym} />
                    )
                case optionKeys.orgAcronym:
                    return (
                        <Picker.Item key={keyName} label={optionsToshow[keyName].orgAcronym} value={optionsToshow[keyName].orgAcronym} />
                    )
                case optionKeys.assetUid:
                    return (
                        <Picker.Item key={keyName} label={optionsToshow[keyName].assetDescription} value={optionsToshow[keyName].assetDescription} />
                    )
            }
        }

    }

    return (
        <>

            <Picker style={styles.picker}
                selectedValue={selectedOptions}
                onValueChange={(itemValue: string, itemIndex) => setSelectedValue(itemValue)}
            >
                <Picker.Item label='Select an option' value='Select an option' />

                {optionsToshow.map((element: TopicType, index: number) => {
                    return (
                        returnPicker(index)
                    )
                })}
            </Picker>


        </>
    )
}