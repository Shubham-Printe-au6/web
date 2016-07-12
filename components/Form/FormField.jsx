import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import ChipList from './ChipList';
import { connect } from 'react-redux';
import { addChip, setFieldText } from '../../actions';
import { form } from '../../reducers';
import { getClosestMatch } from './utility';
import styles from './FormField.css';

const onNewRequest = (value, index, formName, name, dataSourceConfig, dataSource, strict, addChip, autoComplete, setFieldText) => {
  if (index !== -1) {
    addChip(
      formName,
      name, {
        text: value[dataSourceConfig.text],
        value: value[dataSourceConfig.value],
      }
    );
    setFieldText(formName, name, '');
  }
  if (strict && index === -1) {
    const closestMatch = getClosestMatch(
      dataSource, dataSourceConfig,
      AutoComplete.fuzzyFilter, value[dataSourceConfig.text] || value
    );
    if (closestMatch.value) {
      addChip(
        formName,
        name, {
          text: closestMatch.text,
          value: closestMatch.value,
        }
      );
      setFieldText(formName, name, '');
    }
  }
  if (!strict && index === -1) {
    addChip(
      formName,
      name, {
        text: value,
        value,
      }
    );
    setFieldText(formName, name, '');
  }
};

const FormField = ({ name, formName, label, dataSource = [], dataSourceConfig, addChip, className, strict, text, setFieldText }) => {
  let autoComplete;

  return (
    <div className={className}>
      <AutoComplete
        dataSource={dataSource}
        dataSourceConfig={dataSourceConfig}
        floatingLabelText={label}
        filter={AutoComplete.fuzzyFilter}
        maxSearchResults={5}
        onNewRequest={(value, index) =>
          onNewRequest(value, index, formName, name, dataSourceConfig, dataSource, strict, addChip, autoComplete, setFieldText)}
        onUpdateInput={searchText => setFieldText(formName, name, searchText)}
        listStyle={{ textTransform: 'uppercase' }}
        ref={elem => { autoComplete = elem; }}
        searchText={text}
        floatingLabelFocusStyle={{ color: styles.color }}
        underlineFocusStyle={{ borderColor: styles.color }}
        fullWidth
      />
      <ChipList name={name} formName={formName} />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  text: form.getFieldText(state, ownProps.formName, ownProps.name),
});

export default connect(mapStateToProps, { addChip, setFieldText })(FormField);
