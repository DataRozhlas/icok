import { useState, useEffect } from 'react'
import Chart1 from './components/chart1'
import ChartWrapper from './components/chart2-wrapper'

function App() {
  const [absolutne, setAbsolutne] = useState<any>(undefined)
  // const [relativne, setRelativne] = useState<any>(undefined)
  const [celkove, setCelkove] = useState<any>(undefined)
  const [loading, setLoading] = useState<boolean>(true)


  useEffect(() => {
    Promise.all([
      fetch('https://worker-muddy-disk-d6e4.jan-cibulka-ee5.workers.dev/?spreadsheetId=1pWQS5GZ48-HcNaImxETlA4b8Jc9We703yocDEIIejpI&sheet=absolutne')
        .then((response) => response.json())
        .then((data) => setAbsolutne(data.values)),

      // fetch('https://worker-muddy-disk-d6e4.jan-cibulka-ee5.workers.dev/?spreadsheetId=1pWQS5GZ48-HcNaImxETlA4b8Jc9We703yocDEIIejpI&sheet=relativne')
      //   .then((response) => response.json())
      //   .then((data) => setRelativne(data.values)),

      fetch('https://worker-muddy-disk-d6e4.jan-cibulka-ee5.workers.dev/?spreadsheetId=1pWQS5GZ48-HcNaImxETlA4b8Jc9We703yocDEIIejpI&sheet=celkove')
        .then((response) => response.json())
        .then((data) => setCelkove(data.values))
    ]).then(() => {
      setLoading(false);
    });
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">Podíl high-tech zboží na českém vývozu a dovozu</h2>
      <div className="space-y-3">
        <Chart1 data={celkove} type="Vývoz" color="#0FA3B1" />
        <Chart1 data={celkove} type="Dovoz" color="#0FA3B1" />
      </div>
      < ChartWrapper
        absolutne={absolutne}
      />
    </div>
  )
}

export default App
