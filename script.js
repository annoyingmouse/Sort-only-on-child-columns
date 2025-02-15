import {data} from "./data.js"

const createAndPopulateCell = (text, data) => {
  const cell = document.createElement("td")
  cell.textContent = text
  if(data) {
    cell.dataset.sortData = data
  }
  return cell
}

const table = document.getElementById("table")
const thead = table.querySelector("thead")
const tbody = table.querySelector("tbody")

data.forEach(parent => {
  parent.children.forEach(child => {
    child.children.forEach(grandchild => {
      grandchild.children.forEach(greatgrandchild => {
        greatgrandchild.children.forEach(greatgreatgrandchild => {
          const row = document.createElement("tr");
          row.appendChild(createAndPopulateCell(parent.name))
          row.appendChild(createAndPopulateCell(child.name))
          row.appendChild(createAndPopulateCell(grandchild.name))
          row.appendChild(createAndPopulateCell(greatgrandchild.name))
          row.appendChild(createAndPopulateCell(greatgreatgrandchild.name))
          tbody.appendChild(row)
        })
      })
    })
  })
})

const headers = Array.from(thead.querySelectorAll("th"))

headers.forEach((header, index) => {
  header.addEventListener("click", () => {
    const rows = Array.from(tbody.querySelectorAll("tr"))
    const groupedRows = rows.reduce((acc, row) => {
      const cells = Array.from(row.querySelectorAll("td"))
      const key = cells.slice(0, index).map(cell => cell.textContent).join("|")
      if(!acc[key]) {
        acc[key] = []
      }
      acc[key].push(row)
      return acc
    }, {})
    Object.keys(groupedRows).forEach(key => {
      if(header.classList.contains("asc")) {
        groupedRows[key].sort((a, b) => {
          return a.children[index].textContent.localeCompare(b.children[index].textContent)
        })
      } else {
        groupedRows[key].sort((a, b) => {
          return b.children[index].textContent.localeCompare(a.children[index].textContent)
        })
      }
    })
    tbody.innerHTML = ""
    Object.keys(groupedRows).forEach(key => {
      groupedRows[key].forEach(row => {
        tbody.appendChild(row)
      })
    })
    headers.forEach(h => {
      if(h !== header) {
        h.classList.remove("asc")
        h.classList.remove("desc")
      }
    })
    if (header.classList.contains("asc")) {
      header.classList.remove("asc")
      header.classList.add("desc")
    } else {
      header.classList.remove("desc")
      header.classList.add("asc")
    }
  })
})