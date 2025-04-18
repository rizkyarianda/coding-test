'use client';
import { useEffect , useState} from 'react';
import Head from 'next/head';
// import 'datatables.net';

const Home = () => {
  const [datas, setDatas] = useState([]);
  useEffect(() => {
    const fetchAllData = async () => {
      const res = await fetch('http://localhost:8000/api/v1/get-all'); // kalau API lokal
      const data = await res.json();

      setDatas(data.data.salesReps); // asumsi API return { data: [...] }
    };

    fetchAllData();
  }, []);

  return (
    <>
      <Head>
        <title>User List</title>
      </Head>
      <main style={{ padding: 24 }}>
        <h1>User List</h1>
        <table id="userTable" className="display" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Region</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((item) => (
              <tr>
                <td>{item.name}</td>
                <td>{item.role}</td>
                <td>{item.region}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
};

export default Home;
