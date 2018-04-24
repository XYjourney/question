
var record = require('./../models/record.js');
var resStruct = require('./../helper/resStruct.js');
var express = require('express');
var router = express.Router();
var { getClientIp, delNull, ensureAuthenticated } = require('../helper/tools.js')


/**
 * 插入
 */
function insert(req, res) {
  var Record = new record({...req.body, ip: getClientIp(req)});
  Record.save(function (err, resData) {
    if (err) {
      console.log("Error:" + err);
      res.json(resStruct({
        retCode: '500',
        retDesc: '添加失败'
      }))
    }
    else {
      console.log("resData:" + resData);
      res.json(resStruct({
        retCode: '200',
        retDesc: '添加成功'
      }))
    }
  });
}

/**
 * 删除
 */
function del(req, res){
  var data = {...req.body};
  var id = data.id;
  record.findByIdAndRemove(id, function(err, resData){
      if (err) {
        console.log("Error:" + err);
        res.json(resStruct({
          retCode: '500',
          retDesc: '删除失败'
        }))
      }
      else {
        console.log("resData:" + resData);
        res.json(resStruct({
          retCode: '200',
          retDesc: '删除成功'
        }))
      }
  })
}

/**
 * 查询
 */
function query(req, res){
  var wherestr = {'name' : '张三'};
    
  record.find(wherestr, function(err, retData){
      if (err) {
        console.log("Error:" + err);
      }
      else {
        console.log("Res:" + retData);
        res.json(resStruct({
          retCode: '200',
          retDesc: '查询成功',
          ret: retData
        }))
      }
  })
}

function queryByPage(req, res){
  var { name, pageNum, recordPerPage, comments, interests, other } = req.query
  var sort = {'_id':-1};             //排序 
  var condition = {
    $and: [ // 多字段同时匹配
      {name: {$regex: name || ''}},
      {comments: {$regex: comments || '', $options: '$i'}}, //  $options: '$i' 忽略大小写
      {other: {$regex: other || '', $options: '$i'}}
    ]
  }
  
  if (interests && JSON.parse(interests).length !== 0) {
    condition.$and.push({
      interests: JSON.parse(interests)
    })
  }
  var skipnum = (pageNum - 1) * Number(recordPerPage);   //跳过数
  record.count(condition, function(err, totalRecord){
    record.find(condition).skip(skipnum).limit(Number(recordPerPage)).sort(sort).exec(function (err, resData) {
      if (err) {
        console.log(err)
        res.json(resStruct({
          retCode: '500',
          retDesc: '查询失败'
        }))
      } else {
        res.json(resStruct({
          retCode: '200',
          retDesc: '查询成功',
          ret: {
            result: resData,
            paginationInfo: {
              totalRecord 
            }
          }
        }))
      }
    })
  })
}

/**
 * 查询更新
 */
function update(req, res){
  var data = {...req.body}
  var id = data.id
  delete(data['id'])
  record.findByIdAndUpdate(id, data, function(err, resData){
    if (err) {
      res.json(resStruct({
        retCode: '500',
        retDesc: '更新失败'
      }))
    }
    else {
      res.json(resStruct({
        retCode: '200',
        retDesc: '更新成功'
      }))
    }
  })
}
// 
router.post('/insert', insert);
router.delete('/delete', ensureAuthenticated, del);
router.put('/update', ensureAuthenticated, update);
router.get('/list', ensureAuthenticated, queryByPage);
module.exports = router;
 
