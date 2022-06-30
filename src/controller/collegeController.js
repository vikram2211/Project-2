const mongoose = require("mongoose");
const CollegeModel = require("../models/collegeModel");
const InternModel = require("../models/internModel");

const isValid = function (value) {
    if (typeof (value) === "undefined" || typeof (value) === null) return false;
    if (typeof (value) === "string" && value.trim().length === 0) return false;
    if (typeof (value) != "string") return false;
    return true
}



const createCollege = async function (req, res) {
    try {
        let data = req.body;
        const validlogolink = /(http|https(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/
            .test(data.logoLink)


        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Body must be present." })

        if (!isValid(data.name)) return res.status(400).send({ status: false, message: "name is invalid!!" })

        if (!data.name) return res.status(400).send({ status: false, message: "name is required" });

        data.name = data.name.toLowerCase().trim()

        const validateName = await CollegeModel.findOne({ name: data.name })

        if (validateName) return res.status(400).send({ status: false, message: "name must be unique" })


        if (!isValid(data.fullName)) return res.status(400).send({ status: false, message: "fullName is invalid!!" })
        if (!data.fullName) return res.status(400).send({ status: false, message: "fullname is required" });

        if (!data.logoLink) return res.status(400).send({ status: false, message: "logolink is required" });

        if (!validlogolink) return res.status(400).send({ status: false, message: "logolink is invalid" });

        const createCollegeData = await CollegeModel.create(data)

        res.status(201).send({ status: true, message: createCollegeData })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}



const getAllCollegessWithInterns = async function (req, res) {
    try {

        let collegeName = req.query.collegeName

        const collegeData = await CollegeModel.findOne({ name: collegeName, isDeleted: false })

        if (!collegeData) return res.status(404).send({ status: false, message: "no college found" })

        const filterCollege = {
            name: collegeData.name,
            fullName: collegeData.fullName,
            logoLink: collegeData.logoLink
        }

        const collegeId = collegeData._id
        const getInterns = await InternModel.find({ collegeId: collegeId, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 })
        

        if (getInterns.length != 0) {
            filterCollege.interns = getInterns
            res.status(200).send({ status: true, data: filterCollege })
        }

        if (getInterns.length == 0) return res.status(400).send({ status: false, message: "no interns found." })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.createCollege = createCollege;
module.exports.getAllCollegessWithInterns = getAllCollegessWithInterns