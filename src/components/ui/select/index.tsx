import React, { FC, useState } from 'react';
import { ChevronDownIcon } from '@/components/icons/chevron-down';
import ChevronUpIcon from '@/components/icons/chevron-up';
import ClickOutside from '../click-outside';
import { groupBy } from 'lodash';

/*
{"id": 0, "name": "Low to High", "value": "Low to High", "group": "price"},
*/

type SelectType = 'GROUP_SELECT' | 'GENERAL_SELECT';

interface SelectOptionType {
  id: number;
  name: string;
  value: string;
  group?: string;
}

interface SelectProps {
  selectType?: SelectType;
  options: Array<SelectOptionType>;
  cn?: string;
  optionBoardCn?: string;
  optionCn?: string;
  groupCn?: string;
  defaultOption?: any;
  enableUnderline?: boolean;
  placeholder?: string;
  onSelect: (val: any) => void;
}

const Select: FC<SelectProps> = ({
  selectType = 'GENERAL_SELECT',
  options,
  cn,
  optionBoardCn,
  optionCn,
  groupCn,
  defaultOption,
  placeholder,
  onSelect,
}) => {
  const [activeOptionBoard, setActiveOptionBoard] = useState<boolean>(false);
  const [currentOption, setCurrentOption] = useState(defaultOption);

  const renderOptions = () => {
    if (selectType === 'GROUP_SELECT') {
      const optList = groupBy(options, 'group');
      return (
        <div className="max-h-80 overflow-y-auto text-gray-600">
          {Object.keys(optList).map((kv, kvIdx) => {
            return (
              <div key={`${kv}_${kvIdx}`}>
                <div
                  className={`flex cursor-pointer items-center border-gray-600 p-2 ${groupCn}`}
                >
                  {kv.charAt(0).toUpperCase() + kv.slice(1)}
                </div>
                {optList[kv].map((opt, optIdx) => {
                  return (
                    <div
                      key={`${optIdx}_${opt.value}`}
                      className={`flex cursor-pointer items-center border-gray-600 p-2 ${optionCn}`}
                      onClick={() => {
                        selectOption(optIdx);
                      }}
                    >
                      {opt.name}
                    </div>
                  );
                })}
              </div>
            )
          })}
        </div>
      );
    } else {
      return (
        <div className="max-h-80 overflow-y-auto text-gray-600">
          {options.map((opt, optIdx) => {
            return (
              <div
                key={`${optIdx}_${opt.value}`}
                className={`flex cursor-pointer items-center border-gray-600 p-2 ${optionCn}`}
                onClick={() => {
                  selectOption(optIdx);
                }}
              >
                {opt.name}
              </div>
            );
          })}
        </div>
      );
    }
    
  };

  const selectOption = (idx: number) => {
    const item = options[idx];
    setCurrentOption(item);
    setActiveOptionBoard(false);
    onSelect(options[idx]);
  };
  return (
    <ClickOutside
      active={activeOptionBoard}
      onClick={() => setActiveOptionBoard(false)}
    >
      <div>
        <div
          className={`relative cursor-pointer ${cn}`}
          onClick={() => {
            setActiveOptionBoard(!activeOptionBoard);
          }}
        >
          <section className="relative flex w-full items-center">
            <div className={`flex items-center`}>
              <div
                className={`pr-6 ${
                  currentOption === defaultOption
                    ? `text-gray-800 opacity-40`
                    : 'text-gray-500'
                }`}
              >
                {currentOption ? currentOption.name : placeholder}
              </div>
            </div>
            <div className="absolute top-0 right-0 flex h-full flex-col">
              <div className="my-auto">
                {!activeOptionBoard && (
                  <ChevronDownIcon className="text-xs text-gray-400" />
                )}
                {activeOptionBoard && (
                  <ChevronUpIcon className="text-xs text-gray-400" />
                )}
              </div>
            </div>
          </section>

          {activeOptionBoard && (
            <section
              className={`absolute left-0 z-[99999] w-full ${optionBoardCn}`}
            >
              {renderOptions()}
            </section>
          )}
        </div>
      </div>
    </ClickOutside>
  );
};

export default Select;
