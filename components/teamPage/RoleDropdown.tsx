import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';

/**
 * A dropdown component for selecting roles
 * Based on react-native-dropdown-select-list
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of role items with key and value properties
 * @param {Function} props.setSelected - Function to set the selected item
 * @param {string} props.defaultOption - Default selected option
 * @param {string} props.placeholder - Placeholder text when no item is selected
 * @param {Object} props.boxStyles - Additional styles for the dropdown box
 * @param {Object} props.dropdownStyles - Additional styles for the dropdown container
 * @param {Object} props.dropdownItemStyles - Additional styles for dropdown items
 * @param {Object} props.dropdownTextStyles - Additional styles for dropdown item text
 * @param {boolean} props.search - Whether to show search functionality
 * @param {JSX.Element} props.arrowicon - Custom arrow icon
 * @param {string} props.save - What value to save ('key' or 'value')
 */
const RoleDropdown = ({
  data = [],
  setSelected,
  defaultOption,
  placeholder = "Select an option",
  boxStyles = {},
  dropdownStyles = {},
  dropdownItemStyles = {},
  dropdownTextStyles = {},
  search = false,
  arrowicon = <AntIcon name="down" size={12} color="#444" />,
  save = "key"
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  
  useEffect(() => {
    if (defaultOption) {
      const defaultItem = data.find(item => 
        item.key === defaultOption.key || item.value === defaultOption.value
      );
      if (defaultItem) {
        setSelectedItem(defaultItem);
        setSelected(save === "key" ? defaultItem.key : defaultItem.value);
      }
    }
  }, [defaultOption, data]);

  const filteredData = search && searchText 
    ? data.filter(item => 
        item.value.toLowerCase().includes(searchText.toLowerCase()))
    : data;

  const handleSelect = (item) => {
    if (item.disabled) return;
    
    setSelectedItem(item);
    setSelected(save === "key" ? item.key : item.value);
    setDropdown(false);
    setSearchText("");
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Selection Box */}
      <TouchableOpacity
        style={[styles.dropdownBox, boxStyles]}
        onPress={() => setDropdown(!dropdown)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText}>
          {selectedItem ? selectedItem.value : placeholder}
        </Text>
        <View style={styles.dropdownIcon}>{arrowicon}</View>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {dropdown && (
        <Modal
          visible={dropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setDropdown(false)}
        >
          <TouchableWithoutFeedback onPress={() => setDropdown(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          
          <View style={[styles.dropdownContainer, dropdownStyles]}>
            <ScrollView>
              {filteredData.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.dropdownItem,
                    item.disabled && styles.disabledItem,
                    selectedItem?.key === item.key && styles.selectedItem,
                    dropdownItemStyles
                  ]}
                  onPress={() => handleSelect(item)}
                  disabled={item.disabled}
                >
                  <Text 
                    style={[
                      styles.dropdownItemText,
                      item.disabled && styles.disabledItemText,
                      dropdownTextStyles
                    ]}
                  >
                    {item.value}
                  </Text>
                  {selectedItem?.key === item.key && (
                    <AntIcon name="check" size={16} color="#12956B" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 10,
  },
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#333',
  },
  dropdownText: {
    color: '#CFCFCF',
    fontSize: 16,
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  dropdownContainer: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 10,
    maxHeight: '40%',
    top: '30%', 
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  dropdownItemText: {
    color: '#CFCFCF',
    fontSize: 16,
  },
  disabledItem: {
    opacity: 0.5,
  },
  disabledItemText: {
    color: '#666',
  },
  selectedItem: {
    backgroundColor: '#252525'
  },
});

export default RoleDropdown;