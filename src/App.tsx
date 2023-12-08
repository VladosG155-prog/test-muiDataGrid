import { useEffect, useState } from 'react';

import { useGridApiRef, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { IProduct } from './types/product.interface';
import { Box, CircularProgress, Modal } from '@mui/material';
import './App.css';
import { useSaveGrid } from './hooks/useSaveGrid';
import { StyledDataGrid } from './components/CustomDataGrid';
import { darkTheme, lightTheme } from './themes';
type Product = Pick<IProduct, 'id' | 'price' | 'image' | 'title' | 'description'> & {
	date: string;
};

const columns: GridColDef[] = [
	{
		field: 'image',
		headerName: 'Картинка',
		width: 200,
		renderCell: (params) => (
			<img width={200} height={100} style={{ objectFit: 'contain' }} src={params.value} />
		),
	},
	{
		field: 'title',
		headerName: 'Название',
		width: 150,
		cellClassName: 'title',
	},
	{
		field: 'price',
		headerName: 'Цена',
		width: 150,
		cellClassName: 'price',
	},
	{
		field: 'date',
		headerName: 'Дата',
		width: 150,
	},
	{
		field: 'description',
		headerName: 'Описание',
		width: 550,
		cellClassName: 'description',
	},
];

function App() {
	const [products, setProducts] = useState<Product[]>([]);

	const [currTheme, setCurrTheme] = useState(darkTheme);

	const [isOpenModal, setIsOpenModal] = useState(false);

	const [modalData, setModalData] = useState<GridCellParams | null>(null);
	const apiRef = useGridApiRef();
	const initialState = useSaveGrid(apiRef);

	useEffect(() => {
		fetch('https://fakestoreapi.com/products')
			.then((data) => data.json())
			.then((data: IProduct[]) => {
				const newData = data.map((item) => {
					return {
						id: item.id,
						title: item.title,
						price: item.price,
						image: item.image,
						date: new Date(item.id + 2000, 1, 1).toLocaleDateString(),
						description: item.description,
					};
				});
				setProducts(newData);
			});
	}, []);

	const handleCellClick = (data: GridCellParams) => {
		console.log(data);

		setIsOpenModal(true);
		setModalData(data);
	};

	const handleTheme = () => {
		if (currTheme === darkTheme) {
			setCurrTheme(lightTheme);
		} else {
			setCurrTheme(darkTheme);
		}
	};

	if (!initialState) {
		return <CircularProgress />;
	}

	return (
		<div
			className="app"
			style={currTheme === lightTheme ? { background: '#fff' } : { background: '#000' }}>
			<Modal
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				open={isOpenModal}
				onClose={() => setIsOpenModal(false)}>
				<Box
					sx={{
						width: 400,
						background: '#fff',
						height: 300,
						display: 'flex',
						justifyContent: 'center',
						padding: '20px',
						alignItems: 'center',
					}}>
					{modalData?.field === 'image' ? (
						<img
							width={500}
							height={300}
							style={{ objectFit: 'contain' }}
							src={modalData.value as string}
						/>
					) : (
						<h3>{modalData?.value as string}</h3>
					)}
				</Box>
			</Modal>
			<button onClick={handleTheme}>Сменить тему</button>
			<div style={{ height: 600, width: '100%' }}>
				<StyledDataGrid
					apiRef={apiRef}
					initialState={{ ...initialState, pagination: { paginationModel: { pageSize: 5 } } }}
					rows={products}
					theme={currTheme}
					getRowHeight={() => 'auto'}
					columns={columns}
					getEstimatedRowHeight={() => 300}
					rowHeight={100}
					onCellClick={handleCellClick}
				/>
			</div>
		</div>
	);
}

export default App;
