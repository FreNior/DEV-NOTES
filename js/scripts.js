// Elementos
const notesContainer = document.querySelector("#notes-container");
const noteInput = document.querySelector("#note-content");
const addNoteBtn = document.querySelector(".add-note");
const searchInput = document.querySelector("#search-input");
const exportBtn = document.querySelector("#export-notes")


// Funções
const showNotes = () => {
    cleanNotes();
    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed);

        notesContainer.appendChild(noteElement);
    });
};

const cleanNotes = () => {
    notesContainer.replaceChildren([]);
}

const addNote = () => {

    const notes = getNotes();
    const noteObject = {
        id: generateId(),
        content: noteInput.value,
        fixed: false,
    }

    const noteElement = createNote(noteObject.id, noteObject.content);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject)

    saveNotes(notes);

    noteInput.value = "";

};

const createNote = (id, content, fixed) => {
    
    const element = document.createElement("div");

    element.classList.add("note");

    const textArea = document.createElement("textarea");

    textArea.value = content;

    textArea.placeholder = "Adicione algum texto";

    element.appendChild(textArea);

    const pinIcon = document.createElement("i");

    pinIcon.classList.add(...["bi", "bi-pin"]);

    element.appendChild(pinIcon)

    const deleteIcon = document.createElement("i");

    deleteIcon.classList.add(...["bi", "bi-x-lg"]);

    element.appendChild(deleteIcon);

    const duplicateIcon = document.createElement("i");

    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);

    element.appendChild(duplicateIcon);

    if(fixed) {
        element.classList.add("fixed");
    };

    // Eventos do elemento
    element.querySelector("textarea").addEventListener("keyup", (e) => {
        const noteContent = e.target.value;

        updateNote(id, noteContent);

    })

    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixedNote(id)
    })

    element.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNote(id, element) 
    });

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        copyNote(id); 
    })

    return element; 
};

const updateNote = (id, newContent) => {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];
    
    targetNote.content = newContent;

    saveNotes(notes);

}

const toggleFixedNote = (id) => {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes)

    showNotes();
}

const deleteNote = (id, element) => {
    
    const notes = getNotes().filter((note) => note.id !== id);

    saveNotes(notes)

    notesContainer.removeChild(element);

}

const copyNote = (id) => {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false,
    };

    const noteElement = createNote(noteObject.id, noteObject.content, false);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes)

}

// Export
const exportData = () => {
    const notes = getNotes();

    const csvString = [
        ["ID", "conteúdo", "fixado"],
        ...notes.map((note) => [note.id, note.content, note.fixed]),
    ].map((e) => e.join(",")).join("\n");

    const element = document.createElement("a");

    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

    element.target = "_blank";

    element.download = "notes.csv";

    element.click();



}

// Local Storage
const getNotes = () => {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

    return orderedNotes;
}

const generateId = () => {
    
    return Math.floor(Math.random() * 5000)

};

const saveNotes = (notes) => {
    localStorage.setItem("notes", JSON.stringify(notes));
};

const searchNotes = (search) => {
    const searchResults = getNotes().filter((note) => note.content.includes(search)
    )

    if (search !== "") {
        cleanNotes();

        searchResults.forEach((note) => {
            const noteElement = createNote(note.id, note.content);
            notesContainer.appendChild(noteElement)

        })
        return;
    }

    cleanNotes();

    showNotes();
}


// Eventos
addNoteBtn.addEventListener("click", () => addNote());

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    searchNotes(search);
});

exportBtn.addEventListener("click", () => {
    exportData();
})

noteInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        addNote();
    }
})

// Inicialização
showNotes();
