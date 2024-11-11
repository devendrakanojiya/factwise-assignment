import { useState, useEffect } from "react";


// fetch Data
const fetchCelebrityData = async () => {
  try {
    const response = await fetch("/celebrities.json");
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [
      {
        id: 1,
        first: "Top",
        last: "Secret",
        dob: "1000-00-00",
        gender: "Male",
        country: "India",
        description: "I am a hacker with access of celebs data.",
      },
      {
        id: 2,
        first: "Dummy",
        last: "Data",
        dob: "1990-07-25",
        gender: "Female",
        country: "India",
        description: "Dummy Desc. for test",
      },
    ];
  }
};

// DOB calculator
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

function Home() {
  const [celebrities, setCelebrities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [del, setDel] = useState();
  const [val, setVal] = useState(false);
  const [error, setError] = useState("");

//   Will Fetch and modify data with calculatedAge 
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCelebrityData();
      const withAge = data.map((celeb) => ({
        ...celeb,
        age: calculateAge(celeb.dob),
      }));
      setCelebrities(withAge);
    };
    fetchData();
  }, []);

//  Handlers Start 
  const handleAccordionToggle = (id) => {
    if (isEditing) return; 
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCelebrities = celebrities.filter((celeb) => {
    const fullName = `${celeb.first} ${celeb.last}`.toLowerCase();
    return fullName.includes(searchQuery);
  });

  const handleEdit = (id) => {
    const celebrity = celebrities.find((c) => c.id === id);
    if (celebrity.age >= 18) {
      setEditData(celebrity);
      setIsEditing(true);
      setExpandedId(id);
    } else {
      alert("Cannot edit details for minors.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Age Validation
    if (name === "age") {
      if (/^\d*$/.test(value)) {
        setEditData((prev) => ({ ...prev, [name]: value }));
        setError("");
      } else {
        setError("*Enter a valid age");
      }
    }
    // Country validation
    else if (name === "country") {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setEditData((prev) => ({ ...prev, [name]: value }));
        setError("");
      } else {
        setError("*Enter a valid country");
      }
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
      setError("");
    }
  };

  const handleSave = () => {
    setCelebrities((prev) =>
      prev.map((celeb) => (celeb.id === editData.id ? editData : celeb))
    );
    setIsEditing(false);
    setEditData({});
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    setDel(id);
    setVal(true);
  };
  const finalDelete = () => {
    setCelebrities((prev) => prev.filter((celeb) => celeb.id !== del));
    setVal(false);
  };

  const isSaveDisabled = () => {
    const original = celebrities.find((c) => c.id === editData.id);
    return (
      JSON.stringify(original) === JSON.stringify(editData) ||
      !editData.first ||
      !editData.last ||
      !editData.country ||
      !editData.description
    );
  };

  return (
    <div className="App">
      <div className={val ? "container" : "container invisible"}></div>
      <h1>List View</h1>

        {/* Modal Start  */}
        <div className={val ? "modal" : " modal invisible"}>
        <div className="modal-header">
          <div className="pic">
            <p className="boldText padd16">Are you sure you want to delete?</p>
          </div>

          <p onClick={() => setVal(false)} className="secondary padd16 text20 fa-solid fa-xmark"></p>
        </div>

        <div className="modal-details">
          <button onClick={() => setVal(false)} className="del-btn">
            Cancel
          </button>
          <button onClick={() => finalDelete()} className="del-btn og-btn">
            Delete
          </button>
        </div>
      </div>
      {/* Modal Ends  */}

{/* searchBar starts  */}
      <input
        className="inp-searchbar"
        type="text"
        placeholder="Search user"
        value={searchQuery}
        onChange={handleSearchChange}
      />
{/* searchBar Ends  */}

      <div className="celebrity-list">
        {filteredCelebrities.map((celeb) => (
          <div key={celeb.id} className="celebrity-item">
            {/* Celebs Accordino Header Starts  */}
            <div
              className="celebrity-header"
              onClick={() => handleAccordionToggle(celeb.id)}
            >
              <div className="pic">
                <img src={celeb.picture} alt="" />
                {isEditing && editData.id === celeb.id ? (
                  <input
                    className="boldText padd16"
                    type="text"
                    name="name"
                    value={editData.first + " " + editData.last}
                    onChange={handleChange}
                    placeholder="name"
                  />
                ) : (
                  <p className="boldText padd16">{`${celeb.first} ${celeb.last}`}</p>
                )}
              </div>
              {expandedId === celeb.id ? (
                <p className="secondary padd16 text20 fa-solid fa-angle-up"></p>
              ) : (
                <p className="secondary padd16 text20 fa-solid fa-angle-down"></p>
              )}
            </div>
{/* Celebs Accordino Header Ends  */}
{/* Celebs Accordino Details Starts  */}
            {expandedId === celeb.id && (
              <div className="celebrity-details">
                {isEditing && editData.id === celeb.id ? (
                  <>
                  {/* EditMode Starts */}
                    <div className="cage">
                      <div className="secondary">Age </div>
                      <div className="secondary">
                        <input
                          type="text"
                          name="age"
                          value={editData.age}
                          onChange={handleChange}
                          placeholder="Age"
                          required
                        />
                        {error && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "15px",
                              fontStyle: "italic",
                            }}
                          >
                            {error}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="cage">
                      <div className="secondary">Gender </div>
                      <div className="secondary">
                        <select name="gender" id="gender">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="female">Transgender</option>
                          <option value="female">Rather not to say</option>
                          <option value="female">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="cage">
                      <div className="secondary">Country </div>
                      <div className="secondary">
                        <input
                          type="text"
                          name="country"
                          value={editData.country}
                          onChange={handleChange}
                          placeholder="Country"
                          required
                        />
                      </div>
                    </div>
                    <div className="cage parentDiv">
                      <div className="secondary">Description </div>
                      <div className="textDiv">
                        <textarea
                          name="description"
                          value={editData.description}
                          rows="7"
                          cols="50"
                          onChange={handleChange}
                          placeholder="Description"
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="btn">
                      <i
                        onClick={() => handleSave(celeb.id)}
                        style={{ fontSize: "20px" }}
                        disabled={isSaveDisabled()}
                        className="padd16 success fa-regular fa-circle-check"
                      ></i>
                      <i
                        onClick={() => handleCancel(celeb.id)}
                        style={{ fontSize: "20px" }}
                        className="padd16 danger fa-regular fa-circle-xmark"
                      ></i>
                    </div>
                    {/* EditMode Ends  */}
                  </>
                ) : (
                  <>
                  {/* Default Data Start*/}
                    <div className="cage">
                      <div className="secondary">Age </div>
                      <div className="secondary">
                        {" "}
                        <p>{celeb.age}</p>
                      </div>
                    </div>
                    <div className="cage">
                      <div className="secondary">Gender </div>
                      <div className="secondary">
                        <p>{celeb.gender}</p>
                      </div>
                    </div>
                    <div className="cage">
                      <div className="secondary">Country </div>
                      <div className="secondary">
                        <p>{celeb.country}</p>
                      </div>
                    </div>
                    <div className="cage">
                      <div className="secondary">Description </div>
                      <div className="secondary">
                        {" "}
                        <p>{celeb.description}</p>
                      </div>
                    </div>
                    <div className="btn">
                      <i
                        onClick={() => handleEdit(celeb.id)}
                        className="padd16 success fa-solid fa-pen"
                      ></i>
                      <i
                        onClick={() => handleDelete(celeb.id)}
                        className="padd16 danger fa-regular fa-trash-can"
                      ></i>
                    </div>
                    {/* Default Data Ends  */}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

