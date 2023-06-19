export async function graphFormatter(category: String, data: any) {
  if (category && data.length > 0) {
    try {
      let usersArr = [
        {
          month: "Jan",
          value: 0,
          category: category,
        },
        {
          month: "Feb",
          value: 0,
          category: category,
        },
        {
          month: "March",
          value: 0,
          category: category,
        },
        {
          month: "April",
          value: 0,
          category: category,
        },
        {
          month: "May",
          value: 0,
          category: category,
        },
        {
          month: "June",
          value: 0,
          category: category,
        },
        {
          month: "July",
          value: 0,
          category: category,
        },
        {
          month: "Aug",
          value: 0,
          category: category,
        },
        {
          month: "Sep",
          value: 0,
          category: category,
        },
        {
          month: "Oct",
          value: 0,
          category: category,
        },
        {
          month: "Nov",
          value: 0,
          category: category,
        },
        {
          month: "Dec",
          value: 0,
          category: category,
        },
      ];
      for (let i = 0; i < data.length; i++) {
        let parsedDate = new Date(data[i].createdAt);
        let year = parsedDate.getFullYear();
        let currentDate = new Date();
        if (year === currentDate.getFullYear()) {
          let month = parsedDate.getMonth() + 1;
          switch (month) {
            case 1:
              usersArr[0].value += 1;
              break;
            case 2:
              usersArr[1].value += 1;
              break;
            case 3:
              usersArr[2].value += 1;
              break;
            case 4:
              usersArr[3].value += 1;
              break;
            case 5:
              usersArr[4].value += 1;
              break;
            case 6:
              usersArr[5].value += 1;
              break;
            case 7:
              usersArr[6].value += 1;
              break;
            case 8:
              usersArr[7].value += 1;
              break;
            case 9:
              usersArr[8].value += 1;
              break;
            case 10:
              usersArr[9].value += 1;
              break;
            case 11:
              usersArr[10].value += 1;
              break;
            case 12:
              usersArr[11].value += 1;
              break;
          }
        }
      }
      return usersArr;
    } catch (ex) {
      console.log(ex);
    }
  } else {
    console.log("data not present");
    return [];
  }
}
