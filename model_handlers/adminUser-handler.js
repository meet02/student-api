const errors = require("./../utils/dz-errors");
const _ = require("underscore");
const { generateRandomString } = require("./../utils/random-string-generator");
const imagePathConstant = require("./../constants/image-path-constants");
const fs = require("fs");
const query = require("./../utils/query-creator-api");
const dbConstant = require("./../constants/db-constants");
const idGenerator = require("./../utils/id-generator");
const labelConstants = require("./../constants/lable-constants");
const passwordHandler = require("./../utils/password-handler");
const Admin = require("./../models/adminUser.model");
const config = require("./../config");

const nodemailer = require("nodemailer");

const creatAdminUser = (body, files) => {
  return new Promise(async (resolve, reject) => {
    try {
      let string, regex;
      if (body.email) {
        string = body.email.trim();
        regex = new RegExp(["^", string, "$"].join(""), "i");
      }

      let matchColumn = {
        $or: [
          {
            email: regex,
          },
        ],
      };

      // Find Dublicate Record

      let findDublicateRecord = await query.selectWithAndOne(
        dbConstant.dbSchema.adminUsers,
        matchColumn,
        {}
      );
      if (findDublicateRecord) {
        reject(
          errors.customError(
            "Dublicate Email Or Username",
            401,
            "DUBLICATE",
            true
          )
        );
        return;
      }
      let profilePhoto = "";
      if (!_.isEmpty(files) && files["profilePhoto"]) {
        let fileName = files.profilePhoto.name;
        let str = fileName.split(".");
        if (
          str[1].toLowerCase() == "png" ||
          str[1].toLowerCase() == "JPG" ||
          str[1].toLowerCase() == "jpg" ||
          str[1].toLowerCase() == "jpeg"
        ) {
          let updatedFileName =
            "profilePhoto_" + generateRandomString() + "." + str.pop();
          profilePhoto = updatedFileName;

          let filePath = imagePathConstant.ADMIN_IMAGE + updatedFileName;
          console.log("filePath", filePath);
          fs.writeFile(
            filePath,
            files.profilePhoto.data,
            async function (data, err) {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              profilePhoto = updatedFileName;

              passwordHandler.newHash(body.password, (password) => {
                body.password = password;
              });

              let insertObj = {
                userId: idGenerator.generateRandom(labelConstants.ADMIN_USER),
                profilePhoto: profilePhoto,
                name: body.name,
                email: body.email,
                password: body.password,
                gender: body.gender,
                weight: body.weight,
                length: body.length,
                age: body.age,
              };

              let insertDocumnet = await query.insertSingle(
                dbConstant.dbSchema.adminUsers,
                insertObj
              );
              resolve("User Register Successfully");
              return;
            }
          );
        } else {
          reject(
            errors.customError(
              "wrong image type, we only allow png,JPG,jpg,jpeg",
              401,
              "WorngType",
              true
            )
          );
          return;
        }
      } else {
        reject(
          errors.customError(
            "Please Upload Profile Photo",
            404,
            "MISSING_PROFILE_PHOTO"
          ),
          true
        );
        return;
      }
    } catch (err) {
      reject(err);
      return;
    }
  });
};

const loginUserName = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let string, regex;
      if (body.email) {
        string = body.email.trim();
        regex = new RegExp(["^", string, "$"].join(""), "i");
      }
      let matchColumn = {
        $or: [
          {
            email: regex,
          },
        ],
      };
      console.log("matchColumn", matchColumn);
      let getUserName = await query.selectWithAndOne(
        dbConstant.dbSchema.adminUsers,
        matchColumn,
        {}
      );
      if (!getUserName) {
        reject(
          errors.customError(
            "We are not able to find any user with this email or username",
            404,
            "USER NOT FOUND",
            true
          )
        );
        return;
      }
      passwordHandler.verify(
        body.password,
        getUserName.password,
        (password) => {
          if (password) {
            if (getUserName.status == "inactive") {
              reject(
                errors.customError(
                  "Your accout is inactive please contact to Support Team",
                  406,
                  "INACTIVE_ACCOUNT",
                  true
                )
              );
              return;
            }
            getUserName.profilePhoto = `${config.baseUrl}${imagePathConstant.ADMIN_IMAGE_URL}${getUserName.profilePhoto}`;
            console.log("getUserName", getUserName.profilePhoto);
            resolve(getUserName);
            return;
          } else {
            reject(
              errors.customError(
                "Invalied Password",
                406,
                "INVALIED PASSWORD",
                true
              )
            );
            return;
          }
        }
      );
    } catch (err) {
      reject(err);
      return;
    }
  });
};

const updateAdminUser = (body, files) => {
  return new Promise(async (resolve, reject) => {
    try {
      let string, regex;
      if (body.email) {
        string = body.email.trim();
        regex = new RegExp(["^", string, "$"].join(""), "i");
      }

      let updateColum = {};

      if (!_.isEmpty(body.name)) {
        updateColum["name"] = body.name;
      }
      if (!_.isEmpty(body.email)) {
        updateColum["email"] = body.email;
      }
      if (!_.isEmpty(body.gender)) {
        updateColum["gender"] = body.gender;
      }
      if (!_.isEmpty(body.weight)) {
        updateColum["weight"] = body.weight;
      }
      if (!_.isEmpty(body.length)) {
        updateColum["length"] = body.length;
      }
      if (!_.isEmpty(body.age)) {
        updateColum["age"] = body.age;
      }

      if (!_.isEmpty(body.password)) {
        passwordHandler.newHash(body.password, (password) => {
          updateColum["password"] = password;
        });
      }

      let matchColumn = {
        $or: [
          {
            email: regex,
          },
        ],
      };

      // Find Dublicate Record

      let findDublicateRecord = await query.selectWithAndOne(
        dbConstant.dbSchema.adminUsers,
        matchColumn,
        {}
      );

      if (findDublicateRecord) {
        if (findDublicateRecord.userId == body.userId) {
        } else {
          reject(
            "Email Or Username Already Register To Over System Use Diffrent Email or Username",
            406,
            "DUBLICATE EMAIL",
            true
          );
          return;
        }
      }

      let profilePhoto = "";
      if (!_.isEmpty(files) && files["profilePhoto"]) {
        let fileName = files.profilePhoto.name;
        let str = fileName.split(".");
        if (
          str[1].toLowerCase() == "png" ||
          str[1].toLowerCase() == "JPG" ||
          str[1].toLowerCase() == "jpg" ||
          str[1].toLowerCase() == "jpeg"
        ) {
          let updatedFileName =
            "profilePhoto_" + generateRandomString() + "." + str.pop();
          profilePhoto = updatedFileName;

          let filePath = imagePathConstant.ADMIN_IMAGE + updatedFileName;
          console.log("filePath", filePath);
          fs.writeFile(
            filePath,
            files.profilePhoto.data,
            async function (data, err) {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              profilePhoto = updatedFileName;
              if (!_.isEmpty(profilePhoto)) {
                updateColum["profilePhoto"] = profilePhoto;
              }

              let updateUser = await query.updateSinglWithUpdateRecodePromise(
                dbConstant.dbSchema.adminUsers,
                updateColum,
                {
                  userId: body.userId,
                },
                {}
              );

              if (!updateUser) {
                reject(
                  errors.customError(
                    "User Not Found",
                    404,
                    "USER_NOT_FOUND",
                    true
                  )
                );
                return;
              }

              resolve("Data Updated Successfully");
              return;
            }
          );
        } else {
          reject(
            errors.customError(
              "wrong image type, we only allow png,JPG,jpg,jpeg",
              401,
              "WorngType",
              true
            )
          );
          return;
        }
      } else {
        let updateUser = await query.updateSinglWithUpdateRecodePromise(
          dbConstant.dbSchema.adminUsers,
          updateColum,
          {
            userId: body.userId,
          },
          {}
        );

        if (!updateUser) {
          reject(
            errors.customError("User Not Found", 404, "USER_NOT_FOUND", true)
          );
          return;
        }

        resolve("Data Updated Successfully");
        return;
      }
    } catch (err) {
      reject(err);
      return;
    }
  });
};

const getAdminUser = (queryParams) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("queryParams.userId", queryParams);
      let matchColumn = {};
      if (!_.isEmpty(queryParams.userId)) {
        matchColumn["userId"] = queryParams.userId;
      }
      let getUserList = await query.selectWithAndOne(
        dbConstant.dbSchema.adminUsers,
        matchColumn,
        {},
        { created_at: -1 }
      );
      // for (let x in getUserList) {

      // }

      getUserList.profilePhoto = `${config.baseUrl}${imagePathConstant.ADMIN_IMAGE_URL}${getUserList.profilePhoto}`;
      resolve(getUserList);
      return;
    } catch (err) {
      reject(err);
      return;
    }
  });
};

const activeAdminUser = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (_.isEmpty(body.ids)) {
        reject(
          errors.customError(
            "Please Select At Least one Ids",
            404,
            "ID NOT FOUND",
            true
          )
        );
        return;
      }

      body.ids = body.ids.split(",");

      let updateUser = await query.updateMultiple(
        dbConstant.dbSchema.adminUsers,
        {
          status: "active",
        },
        {
          userId: { $in: body.ids },
        }
      );

      resolve("Data Updated Successfully");
      return;
    } catch (err) {
      reject(err);
      return;
    }
  });
};

const inactiveAdminUser = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (_.isEmpty(body.ids)) {
        reject(
          errors.customError(
            "Please Select At Least one Ids",
            404,
            "ID NOT FOUND",
            true
          )
        );
        return;
      }

      body.ids = body.ids.split(",");

      let updateAdmin = await query.updateMultiple(
        dbConstant.dbSchema.adminUsers,
        {
          status: "inactive",
        },
        {
          userId: { $in: body.ids },
        }
      );

      resolve("Data Updated Successfully");
      return;
    } catch (err) {
      reject(err);
      return;
    }
  });
};

const deleteAdminUser = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (_.isEmpty(body.ids)) {
        reject(
          errors.customError(
            "Please Select At Least one Ids",
            404,
            "ID NOT FOUND",
            true
          )
        );
        return;
      }

      body.ids = body.ids.split(",");

      let DeleteData = await query.removeMultiple(
        dbConstant.dbSchema.adminUsers,
        {
          userId: {
            $in: body.ids,
          },
        }
      );

      resolve("Data Deleted Successfully");
      return;
    } catch (err) {
      reject(err);
      return;
    }
  });
};

const forgotPasswordSendOtp = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let string, regex;
      if (body.email) {
        string = body.email.trim();
        regex = new RegExp(["^", string, "$"].join(""), "i");
      }

      let matchColumn = {
        $or: [
          {
            email: regex,
          },
        ],
      };

      let getUserInfo = await query.selectWithAndOne(
        dbConstant.dbSchema.adminUsers,
        matchColumn,
        {}
      );

      if (!getUserInfo) {
        reject(
          errors.customError(
            "We are not able to find any users with this email id",
            404,
            "USER NOT FOUND",
            true
          )
        );
        return;
      } else {
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "parthvip28021994@gmail.com", // generated ethereal user
            pass: "Parthvi@7874", // generated ethereal password
          },
        });

        let OTP = Math.floor(1000 + Math.random() * 9000);

        let info = await transporter.sendMail({
          from: "parthvip28021994@gmail.com", // sender address
          to: body.email,
          subject: "RESET PASSWORD OTP", // Subject line
          // text: requestParam.message // plain text body
          html: `<h3>Hello <strong> ${getUserInfo.name}</strong> Your OTP is <strong>${OTP}</strong> </h3>`, // html body
        });

        let updateUserInfo = await query.updateSinglWithUpdateRecodePromise(
          dbConstant.dbSchema.adminUsers,
          { otp: OTP },
          {
            userId: getUserInfo.userId,
          }
        );

        resolve({ otp: OTP });
        return;
      }
    } catch (error) {
      reject(error);
      return;
    }
  });
};

const verifyOtp = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let string, regex;
      if (body.email) {
        string = body.email.trim();
        regex = new RegExp(["^", string, "$"].join(""), "i");
      }

      let matchColumn = {
        $or: [
          {
            email: regex,
          },
        ],
      };

      let getUserInfo = await query.selectWithAndOne(
        dbConstant.dbSchema.adminUsers,
        matchColumn,
        {}
      );

      if (!getUserInfo) {
        reject(
          errors.customError(
            "We are not able to find any users with this email id",
            404,
            "USER NOT FOUND",
            true
          )
        );
        return;
      } else {
        if (getUserInfo.otp == body.otp) {
          let updateOtp = await query.updateSinglWithUpdateRecodePromise(
            dbConstant.dbSchema.adminUsers,
            { otp: 0 },
            matchColumn,
            {}
          );
          resolve(updateOtp);
          return;
        } else {
          reject(
            errors.customError(
              "You have entered an invalid otp",
              506,
              "INVALIED_OTP",
              true
            )
          );
          return;
        }
      }
    } catch (error) {
      reject(error);
      return;
    }
  });
};

module.exports = {
  creatAdminUser,
  loginUserName,
  updateAdminUser,
  getAdminUser,
  activeAdminUser,
  inactiveAdminUser,
  deleteAdminUser,
  forgotPasswordSendOtp,
  verifyOtp,
};
