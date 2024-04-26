const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());
app.use(express.json());

const resumes = [];
let validatedResumes = [];

app.post('/upload', upload.single('resume'), (req, res) => {
  const { file } = req;
  if (file) {
    resumes.push({ id: resumes.length + 1, name: file.originalname });
    res.json({ message: "Resume uploaded", resumes });
  } else {
    res.status(400).send("No file uploaded.");
  }
});

app.get('/resumes',(req,res)=>{
    res.status(200).json(resumes)
})

app.post('/validate', (req, res) => {
  const { ids } = req.body;
  ids.forEach(id => {
    const index = resumes.findIndex(resume => resume.id === id);
    if (index !== -1) {
      validatedResumes.push(resumes[index]);
      resumes.splice(index, 1);
    }
  });
  res.json({ resumes, validatedResumes });
});

app.post('/communicate', (req, res) => {
  const { ids } = req.body;
  validatedResumes = validatedResumes.filter(resume => !ids.includes(resume.id));
  res.json({ validatedResumes });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
