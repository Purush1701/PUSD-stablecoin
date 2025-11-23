**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [pragma](#pragma) (1 results) (Informational)
 - [solc-version](#solc-version) (4 results) (Informational)
## pragma
Impact: Informational
Confidence: High
 - [ ] ID-0
4 different versions of Solidity are used:
	- Version constraint ^0.8.20 is used by:
		-[^0.8.20](node_modules/@openzeppelin/contracts/access/Ownable.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/Context.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/Pausable.sol#L4)
		-[^0.8.20](contracts/PUSDv3.sol#L2)
	- Version constraint >=0.8.4 is used by:
		-[>=0.8.4](node_modules/@openzeppelin/contracts/interfaces/draft-IERC6093.sol#L3)
	- Version constraint >=0.4.16 is used by:
		-[>=0.4.16](node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol#L4)
	- Version constraint >=0.6.2 is used by:
		-[>=0.6.2](node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol#L4)

node_modules/@openzeppelin/contracts/access/Ownable.sol#L4


## solc-version
Impact: Informational
Confidence: High
 - [ ] ID-1
Version constraint >=0.4.16 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
	- DirtyBytesArrayToStorage
	- ABIDecodeTwoDimensionalArrayMemory
	- KeccakCaching
	- EmptyByteArrayCopy
	- DynamicArrayCleanup
	- ImplicitConstructorCallvalueCheck
	- TupleAssignmentMultiStackSlotComponents
	- MemoryArrayCreationOverflow
	- privateCanBeOverridden
	- SignedArrayStorageCopy
	- ABIEncoderV2StorageArrayWithMultiSlotElement
	- DynamicConstructorArgumentsClippedABIV2
	- UninitializedFunctionPointerInConstructor_0.4.x
	- IncorrectEventSignatureInLibraries_0.4.x
	- ExpExponentCleanup
	- NestedArrayFunctionCallDecoder
	- ZeroFunctionSelector.
It is used by:
	- [>=0.4.16](node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol#L4)

node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol#L4


 - [ ] ID-2
Version constraint >=0.8.4 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
	- FullInlinerNonExpressionSplitArgumentEvaluationOrder
	- MissingSideEffectsOnSelectorAccess
	- AbiReencodingHeadOverflowWithStaticArrayCleanup
	- DirtyBytesArrayToStorage
	- DataLocationChangeInInternalOverride
	- NestedCalldataArrayAbiReencodingSizeValidation
	- SignedImmutables.
It is used by:
	- [>=0.8.4](node_modules/@openzeppelin/contracts/interfaces/draft-IERC6093.sol#L3)

node_modules/@openzeppelin/contracts/interfaces/draft-IERC6093.sol#L3


 - [ ] ID-3
Version constraint >=0.6.2 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
	- MissingSideEffectsOnSelectorAccess
	- AbiReencodingHeadOverflowWithStaticArrayCleanup
	- DirtyBytesArrayToStorage
	- NestedCalldataArrayAbiReencodingSizeValidation
	- ABIDecodeTwoDimensionalArrayMemory
	- KeccakCaching
	- EmptyByteArrayCopy
	- DynamicArrayCleanup
	- MissingEscapingInFormatting
	- ArraySliceDynamicallyEncodedBaseType
	- ImplicitConstructorCallvalueCheck
	- TupleAssignmentMultiStackSlotComponents
	- MemoryArrayCreationOverflow.
It is used by:
	- [>=0.6.2](node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol#L4)

node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol#L4


 - [ ] ID-4
Version constraint ^0.8.20 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
	- VerbatimInvalidDeduplication
	- FullInlinerNonExpressionSplitArgumentEvaluationOrder
	- MissingSideEffectsOnSelectorAccess.
It is used by:
	- [^0.8.20](node_modules/@openzeppelin/contracts/access/Ownable.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/Context.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/Pausable.sol#L4)
	- [^0.8.20](contracts/PUSDv3.sol#L2)

node_modules/@openzeppelin/contracts/access/Ownable.sol#L4


