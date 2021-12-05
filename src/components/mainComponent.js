import React, { useState } from "react";
import "./mainComponent.css";
import "react-sortable-tree/style.css";
import XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const MainComponent = () => {
  const [headerData, setHeaderData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    let chartData = Chart;
    console.log("chartData", chartData);
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      const data1 = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      setResultData([...data]);
      console.log("Data>>>", data); // shows that excel data is read
      convertToJson(data1); // shows data in json format
    };
    reader.readAsBinaryString(file);
  };

  const convertToJson = (csv) => {
    var lines = csv.split("\n");
    var headers = lines[0].split(",");
    setHeaderData([...headers]);
  };

  const dragStarted = (e, index) => {
    e.dataTransfer.setData("columnIndex", index);
  };

  const onDragging = (e) => {
    e.preventDefault();
  };

  const onDropped = (e) => {
    let columnIndex = e.dataTransfer.getData("columnIndex");
    let isPresent = false;
    tableData.map((item) => {
      if (item === columnIndex) {
        isPresent = true;
      }
    });

    if (!isPresent) {
      let data = [...tableData, columnIndex];
      setTableData(data);
    }
    let chartData = tableData.map((item) => {
      return resultData.map((el) => {
        return el[headerData[item]];
      });
    });

    setChartData(chartData);
  };

  return (
    <>
      <div className="container1">
        {headerData.length ? (
          <div className="tree-wrapper">
            <ul className="tree">
              <li>
                Select Column
                <ul>
                  {headerData.map((data, index) => {
                    return (
                      <div>
                        <li
                          id={index}
                          draggable
                          onDragStart={(e) => dragStarted(e, index)}
                        >
                          {data}
                        </li>
                      </div>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </div>
        ) : null}

        <div className="upload-btn-wrapper">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleUpload}
            id="upload"
            style={{ display: "none" }}
          />
          <label htmlFor="upload">
            <button
              className="btn"
              onClick={() => document.getElementById("upload").click()}
            >
              Upload
            </button>
          </label>
        </div>
      </div>
      <div
        className="container2"
        droppable
        onDrop={(e) => onDropped(e)}
        onDragOver={(e) => onDragging(e)}
      >
        <div className="container2-first">
          {tableData.length ? (
            <table>
              <tr>
                {tableData.map((item) => {
                  return (
                    <th style={{ width: "200px !important" }}>
                      {headerData[item]}
                    </th>
                  );
                })}
              </tr>
              <tr>
                {tableData.map((item) => {
                  return (
                    <td>
                      {resultData.map((el) => {
                        console.log("resultData", resultData);
                        return (
                          <tr>
                            <td>{el[headerData[item]]}</td>
                          </tr>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            </table>
          ) : (
            <div className="empty-text">
              <h3>Drag and Drop the Colums Here !!</h3>
            </div>
          )}
        </div>
        <div style={{ height: "40%" }}>
          {tableData.length ? (
            <Bar
              data={{
                labels: chartData,
                datasets: [
                  {
                    label: "",
                    data: chartData,
                  },
                ],
              }}
              height={150}
              width={600}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default MainComponent;
