'use client';
import { useEffect , useState} from 'react';
import Head from 'next/head';
import { useTable, getFilteredRowModel, ColumnDef, getCoreRowModel, useReactTable, flexRender , ColumnFiltersState,   SortingState, getSortedRowModel,} from '@tanstack/react-table'
import Select from 'react-select';
import ReactSlider from 'react-slider';

type SalesRep = {
  name: string
  role: string
  region: string
  total_closed_won: number
}

const Home = () => {
  const [datas, setDatas] = useState<SalesRep[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedData, setSelectedData] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [selectedOption, setSelectedOption] = useState(null);
  const [minPrice, setMinPrice] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      const res = await fetch(`http://localhost:8000/api/v1/get-all?deal=${minPrice}`); // kalau API lokal
      const data = await res.json();
      setDatas(data.data); // asumsi API return { data: [...] }
    };

    fetchAllData();
  }, [minPrice]);

  
  const columns:ColumnDef<SalesRep>[] =  [
    {
      header: 'Name',
      accessorKey: 'name',
      enableColumnFilter: true,
      cell: info => info.getValue(),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      enableColumnFilter: true,
      cell: info => info.getValue(),
    },
    {
      header: 'Region',
      accessorKey: 'region',
      enableColumnFilter: true,
      cell: info => info.getValue(),
    },
    {
      header: 'Total Deal Won',
      accessorKey: 'total_closed_won',
      enableColumnFilter: false,
      cell: info => convertToCurrency(info.getValue())
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleViewDetail(row.original.id)} 
        >
          Detail
        </button>
      ),
    },
  ]
  // Filter harga berdasarkan rentang
  const priceFilter = (rows, columnIds, filterValue) => {
    const [min, max] = filterValue;
    return rows.filter((row) => {
      const price = row.values.price;
      return price >= min && price <= max;
    });
  };
    const handleViewDetail = async(id: string) => {
      setLoading(true); // Set loading state sebelum fetch
      const res = await fetch(`http://localhost:8000/api/v1/get-by-id/${id}`); // Fetch data detail
      const data = await res.json();
      const result = data.data

      console.log(result)
      setSelectedData(result);
      setIsModalOpen(true); 
      setLoading(false); 
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedData(null);
    };

  const table = useReactTable({
    data: datas,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    autoResetPageIndex: false, 
    state: {
      columnFilters,
      sorting,
      globalFilter,
    },
  })

  const convertToCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sales</h1>
      <div>
        <h6 className="font-bold mb-4">Filter By Total Won Deal</h6>
        {/* Slider */}
        <div className="mb-6">
          <ReactSlider
            className="w-full h-2 bg-gray-300 rounded"
            thumbClassName="w-4 h-4 bg-blue-500 rounded-full cursor-pointer"
            trackClassName="bg-blue-300 h-2 rounded"
            min={10000}
            max={200000}
            step={10000}
            value={minPrice}
            onChange={(val) => setMinPrice(val as number)}
            // pearling
            // minDistance={10}
          />
           <div className="text-sm mt-2">Minimum Deal: {convertToCurrency(minPrice)}</div>
        </div>        
      </div>
  
      <table className="border-collapse border w-full">
      <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border px-4 py-2 bg-gray-100">
                  {header.isPlaceholder ? null : (
                    <div>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? ''}
                      </div>

                      {/* Filter Input */}
                      {header.column.getCanFilter() && (
                        <div>
                          <input
                            type="text"
                            value={(header.column.getFilterValue() ?? '') as string}
                            onChange={e => header.column.setFilterValue(e.target.value)}
                            placeholder={`Search...`}
                            className="mt-1 border px-2 py-1 text-sm w-full"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

        {/* Modal untuk menampilkan detail data */}
        {isModalOpen && selectedData && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Detail Sales</h2>
            <p><strong>Name:</strong> {selectedData.name}</p>
            <p><strong>Role:</strong> {selectedData.role}</p>
            <p><strong>Region:</strong> {selectedData.region}</p>
            {Array.isArray(selectedData.skills) && selectedData.skills.length > 0 ? (
                  <p><strong>Skills:</strong> {selectedData.skills.join(', ')}</p> // Menampilkan array sebagai string
                ) : (
                  <p>No skills available.</p>
            )}
           {/* Menampilkan array of objects di dalam modal */}
           <h6 className="mt-2 font-bold">Clients:</h6>
                <ul className="list-disc ml-6">
                  {selectedData.clients.map((client, index) => (
                    <li key={index}>
                      <p><strong>Client Name:</strong> {client.name}</p>
                      <p><strong>Industry:</strong> {client.industry}</p>
                      <p><strong>Contact:</strong> {client.contact}</p>
                    </li>
                  ))}
                </ul>
           <h6 className="mt-2 font-bold">Deals:</h6>
                <ul className="list-disc ml-6">
                  {selectedData.deals.map((deal, index) => (
                    <li key={index}>
                      <p><strong>Client Name:</strong> {deal.client}</p>
                      <p><strong>Deal:</strong> {convertToCurrency(deal.value)}</p>
                      <p><strong>Status Deal:</strong> {deal.status}</p>
                    </li>
                  ))}
                </ul>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
};

export default Home;
