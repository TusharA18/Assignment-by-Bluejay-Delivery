import readXlsxFile from "read-excel-file";

const readExcelFile = async (url) => {
   let data = await readXlsxFile(input.files[0]);

   data.shift();

   return data;
};

const sortFiles = (files) => {
   let data = files.filter((d) => d[2] != null);

   data = data.sort((a, b) => {
      const aDate = new Date(a[2]);
      const bDate = new Date(b[2]);

      return aDate.getDate() - bDate.getDate();
   });

   data = data.sort((a, b) => {
      const aDate = new Date(a[2]);
      const bDate = new Date(b[2]);

      return aDate.getTime() - bDate.getTime();
   });

   return data;
};

const checkConsecutiveDays = (data) => {
   let ans = [];

   let temp = {};

   for (let i = 0; i < data.length; i++) {
      let date = new Date(data[i][2]).getDate();
      let name = data[i][7];

      if (temp[name] == undefined) {
         temp[name] = [date, 0, i];
      } else {
         if (temp[name][0] === date) {
            continue;
         }

         if (temp[name][0] + 1 === date) {
            temp[name][0] += 1;
            temp[name][1] += 1;
         } else {
            temp[name][0] = date;
            temp[name][1] = 0;
         }
      }

      if (temp[name][1] == 7) {
         let index = temp[name][2];

         let flag = false;

         for (let val in ans) {
            if (val[0] == name) {
               flag = true;

               break;
            }
         }

         if (flag) {
            continue;
         }

         ans.push([data[index][7], data[index][0]]);
      }
   }

   return ans;
};

const checkShiftTime = (data) => {
   let ans = [];

   let temp = {};

   for (let i = 0; i < data.length; i++) {
      let name = data[i][7];
      let date = new Date(data[i][2]).getDate();
      let start = new Date(data[i][2]).getTime();
      let end = new Date(data[i][3]).getTime();

      if (temp[name] == undefined) {
         temp[name] = [start, end, 0, i, date];
      } else {
         if (date === temp[name][4]) {
            temp[name][2] += start - temp[name][1];

            temp[name][0] = start;
            temp[name][1] = end;
         } else {
            temp[name][0] = start;
            temp[name][1] = end;
            temp[name][2] = 0;
            temp[name][4] = date;
         }
      }

      let freeHours = new Date(temp[name][2]).getUTCHours();

      if (freeHours > 1 && freeHours < 10) {
         let index = temp[name][3];

         let flag = false;

         for (let val in ans) {
            if (val[0] == name) {
               flag = true;

               break;
            }
         }

         if (flag) {
            continue;
         }

         ans.push([
            data[index][7],
            data[index][0],
            new Date(temp[name][2]).getUTCHours(),
         ]);
      }
   }

   return ans;
};

const checkSingleShift = (data) => {
   let ans = [];

   let temp = {};

   for (let i = 0; i < data.length; i++) {
      let name = data[i][7];
      let time = data[i][4];

      let date = new Date(data[i][2]).getDate();

      let hour = parseInt(time.split(":")[0]);
      let minute = parseInt(time.split(":")[1]);

      if (temp[name] == undefined) {
         temp[name] = [date, hour, minute, i];
      } else {
         if (date !== temp[name[0]]) {
            temp[name][0] = date;
            temp[name][1] = hour;
            temp[name][2] = minute;
         } else {
            let tempMinute = temp[name][2];
            tempMinute += minute;

            temp[name][1] += hour;

            if (tempMinute > 60) {
               let tHrs = Math.floor(tempMinute / 60);

               temp[name][1] += tHrs;
               temp[name][2] += tempMinute - 60 * tHrs;
            }
         }
      }

      if (temp[name][1] > 14) {
         let index = temp[name][3];

         let flag = false;

         for (let val in ans) {
            if (val[0] == name) {
               flag = true;

               break;
            }
         }

         if (flag) {
            continue;
         }

         ans.push([data[index][7], data[index][0]]);
      }
   }

   return ans;
};

const makeCheckConsecutiveDays = (data) => {
   let consecutiveDays = checkConsecutiveDays(data);

   let table = document.getElementById("table-1");

   // table head
   let thead = document.createElement("thead");

   let tr = document.createElement("tr");

   let th1 = document.createElement("th");
   let th2 = document.createElement("th");
   let th3 = document.createElement("th");

   th1.textContent = "Sno.";
   th2.textContent = "Employee Name";
   th3.textContent = "Position";

   tr.appendChild(th1);
   tr.appendChild(th2);
   tr.appendChild(th3);

   thead.appendChild(tr);

   // table body
   let tbody = document.createElement("tbody");

   let count = 1;

   consecutiveDays.map((doc) => {
      let tr = document.createElement("tr");

      let cell1 = document.createElement("td");
      let cell2 = document.createElement("td");
      let cell3 = document.createElement("td");

      cell1.textContent = count++;
      cell2.textContent = doc[0];
      cell3.textContent = doc[1];

      tr.appendChild(cell1);
      tr.appendChild(cell2);
      tr.appendChild(cell3);

      tbody.appendChild(tr);
   });

   table.appendChild(thead);
   table.appendChild(tbody);
};

const makeCheckShiftTime = (data) => {
   const shiftTime = checkShiftTime(data);

   let table = document.getElementById("table-2");

   // table head
   let thead = document.createElement("thead");

   let tr = document.createElement("tr");

   let th1 = document.createElement("th");
   let th2 = document.createElement("th");
   let th3 = document.createElement("th");

   th1.textContent = "Sno.";
   th2.textContent = "Employee Name";
   th3.textContent = "Position";

   tr.appendChild(th1);
   tr.appendChild(th2);
   tr.appendChild(th3);

   thead.appendChild(tr);

   // table body
   let tbody = document.createElement("tbody");

   let count = 1;

   shiftTime.map((doc) => {
      let tr = document.createElement("tr");

      let cell1 = document.createElement("td");
      let cell2 = document.createElement("td");
      let cell3 = document.createElement("td");

      cell1.textContent = count++;
      cell2.textContent = doc[0];
      cell3.textContent = doc[1];

      tr.appendChild(cell1);
      tr.appendChild(cell2);
      tr.appendChild(cell3);

      tbody.appendChild(tr);
   });

   table.appendChild(thead);
   table.appendChild(tbody);
};

const makeCheckSingleShift = (data) => {
   const singleShift = checkSingleShift(data);

   let table = document.getElementById("table-3");

   // table head
   let thead = document.createElement("thead");

   let tr = document.createElement("tr");

   let th1 = document.createElement("th");
   let th2 = document.createElement("th");
   let th3 = document.createElement("th");

   th1.textContent = "Sno.";
   th2.textContent = "Employee Name";
   th3.textContent = "Position";

   tr.appendChild(th1);
   tr.appendChild(th2);
   tr.appendChild(th3);

   thead.appendChild(tr);

   // table body
   let tbody = document.createElement("tbody");

   let count = 1;

   singleShift.map((doc) => {
      let tr = document.createElement("tr");

      let cell1 = document.createElement("td");
      let cell2 = document.createElement("td");
      let cell3 = document.createElement("td");

      cell1.textContent = count++;
      cell2.textContent = doc[0];
      cell3.textContent = doc[1];

      tr.appendChild(cell1);
      tr.appendChild(cell2);
      tr.appendChild(cell3);

      tbody.appendChild(tr);
   });

   table.appendChild(thead);
   table.appendChild(tbody);
};

const main = () => {
   const input = document.getElementById("input");

   input.addEventListener("change", async () => {
      let data = await readExcelFile(input.files[0]);

      data = sortFiles(data);

      makeCheckConsecutiveDays(data);

      makeCheckShiftTime(data);

      makeCheckSingleShift(data);

      const container = document.getElementById("container");

      container.style.display = "flex";
   });
};

main();
