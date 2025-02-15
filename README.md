# Sort only on child columns

I was recently asked to help sort table columns, but there was a specific use case. The original data was a mixture of arrays and objects; some of the object keys represented the text to display in the table cell, some of the arrays represented child elements, and some object keys would become further text within cells, meaning that the elements at the top of the JSON tree would be repeated an arbitrary number of times. The use case was that if a column header representing a child element should be clicked, only the children and their ancestors would be sorted, and the parents would remain in the same order.

After some head-scratching, I concluded that the table had to effectively be chunked into blocks identified by the ancestors of the currently selected column. These chunks could then be sorted, and after discarding the idea of sorting them in place, I realised I'd need to empty the table and place them all back in order - thankfully, good HTML practice meant that I had a table header and a table body to play with (do you hate it as much as I when people neglect to use a <code>thead</code> element?).

That explanation seems relatively straightforward, but it wasn't—it took an age of thinking and ensuring things worked as expected.

The following is the relevant function:

```javascript
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

```
Here is a working example with data that bears no resemblance to that in the example data initially provided: https://replit.com/@annoyingmouse/Sort-only-on-child-columns?v=1
