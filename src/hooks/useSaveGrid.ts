import { GridInitialState } from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useCallback, useLayoutEffect, useState } from 'react';

export const useSaveGrid = (ref: React.MutableRefObject<GridApiCommunity>) => {
	const [initialState, setInitialState] = useState<GridInitialState>();

	const saveSnapshot = useCallback(() => {
		if (ref?.current?.exportState && localStorage) {
			const currentState = ref.current.exportState();
			localStorage.setItem('dataGridState', JSON.stringify(currentState));
		}
	}, [ref]);

	useLayoutEffect(() => {
		const stateFromLocalStorage = localStorage?.getItem('dataGridState');
		setInitialState(stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : {});
		window.addEventListener('beforeunload', saveSnapshot);

		return () => {
			window.removeEventListener('beforeunload', saveSnapshot);
			saveSnapshot();
		};
	}, [saveSnapshot]);

	return initialState;
};
