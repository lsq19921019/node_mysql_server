let express = require('express'); 
let cors = require('cors');  
let db = require('./db');

let utiltool = require('./util')

let Visual =  require('./models/blade_visual');
let Map =  require('./models/blade_visual_map');
let Category = require('./models/blade_visual_category');
let Config = require('./models/blade_visual_config');

//引入express模块
let app = express();
//引入跨域配置
app.use(cors());
//创建express的实例

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))

app.use('/uploads',express.static(__dirname+'/uploads'))
app.use('/admin',express.static(__dirname+'/admin'))


app.get('/avue/api/getAuthInfo',function (req,res) {

    var http = require('http'); 
       
    var qs = require('querystring'); 

    var data = { 
        appkey: 'dingnljgwt6lv3omwzb8', 
        appsecret: 'oAGCqmJT3ya6b26bJNPzvzIwJOVhMkvCAqO1CmhRazu1DQ5gV-DdlQaHSiJG_UFN'
    };//这是需要提交的数据 
       
       
    var content = qs.stringify(data); 
       
    var options = { 
        hostname: 'http://oapi.dingtalk.com', 
        // port: 10086, 
        path: '/gettoken?' + content, 
        method: 'GET' 
    }; 
       
    var req = http.request(`http://oapi.dingtalk.com/gettoken?appkey=${data.appkey}&appsecret=${data.appsecret}`, function (res) { 
        console.log('STATUS: ' + res.statusCode); 
        console.log('HEADERS: ' + JSON.stringify(res.headers)); 
        res.setEncoding('utf8'); 
        res.on('data', function (chunk) { 
            console.log('BODY: ' + chunk); 
            // return chunk;
        });
        // res.on('end', function (chunk) { 
        //     // console.log('88888')
            
        // });
        // res.send();
        // res.end('6666');
    }); 
       
    req.on('error', function (e) { 
        console.log('problem with request: ' + e.message); 
    }); 
       
    req.end(res.body);
    // app.get('/')
    // res.send('hello aue-data');
});


app.get('/',function (req,res) {
    
    res.send('hello aue-data');
});

//获取模板列表;
app.get('/avue/api/visual/list',function (req,res) {
    // req.query.current
    // console.log(Visual(db.db,db.Sequelize));
    console.log(req.query);
    
    let page=parseInt((req.query.current==undefined)?0:req.query.current-1);
    let size = parseInt((req.query.size==undefined)?10:req.query.size);
    let category = (req.query.category==undefined)?1:req.query.category;
    // console.log(req.query.size);
    db.connection.sync({
        force:false
    }).then(async ()=>{
        let visuallist = Visual(db.connection,db.Sequelize);
        let results = await visuallist.findAndCountAll({
            offset: page*size, limit: size,
            where: {
                category: category
            }
        });
        // console.log(results);
        return {code:200,msg:'success',success:true,data:{records:results.rows,total:results.count,pages:parseInt(results.count/size)+parseInt((results.count%size)>0?1:0),size:size,current:page+1}};
    }).then((result)=>{
        res.send(result)
    });
});


//获取模板详情;
app.get('/avue/api/visual/detail', function (req,res) {
    // req.query.current
    // console.log(Visual(db.db,db.Sequelize));
    let id = req.query.id;
    console.log(id);
    // let page=(req.query.current==undefined)?0:req.query.current;
    // let size = (req.query.size==undefined)?10:req.query.size;
    // let category = (req.query.category==undefined)?1:req.query.category;

    db.connection.sync({
        force:false
    }).then(async ()=>{
        let visuallist = Visual(db.connection,db.Sequelize);
        let results = await visuallist.findAll({
            where: {
                id: id
            }
        });
        // console.log(results);
        return results;
    }).then(async (results)=>{
        
        let configlist =Config(db.connection,db.Sequelize);
        let results_ = await configlist.findAll({
            where: {
                visualId: id
            }
        });
        console.log(results_);
        return {data:{config:results_[0],visual:results[0]}};
    }).then((result)=>{

        res.send(result)
    });
});


//复制模板;
app.use('/avue/api/visual/copy',async function (req,res,next) {
    console.log('===============================================');
    console.log(req.body);
    console.log('===============================================');


    // let req_visual_data = req.body.visual;
    // let req_config_data = req.body.config;

    //visual表新增的id
    let visual_id = utiltool.genID(20);

    // let addsql_0 = 'INSERT INTO blade_visual(id,password,category,status,title) VALUES(?,?,?,?,?)';
    // let addsqlparams_0 = [id,req_visual_data.password,req_visual_data.category,req_visual_data.status,req_visual_data.title];

    //config表新增的id
    let id_ = utiltool.genID(20);
    //请求复制的id
    let id = req.body.id;



    

    db.connection.sync({
        force:false
    }).then(async ()=>{
        let visuallist = Visual(db.connection,db.Sequelize);
        let results = await visuallist.findAll({
            where: {
                id: id
            }
        });
        // console.log(results);
        return results;
    }).then(async (results)=>{
        
    let configlist =Config(db.connection,db.Sequelize);
        let results_ = await configlist.findAll({
            where: {
                visualId: id
            }
        });
        // console.log(results_);
        return {config:results_[0],visual:results[0]};
    }).then(async (copyData)=>{
        let visuallist = Visual(db.connection,db.Sequelize);
//         console.log('================================');
// console.log(copyData.visual.password);
// console.log('================================');

        // let visual_id = utiltool.genID(20);
        console.log(visual_id);
        console.log('================================');
        let results = await visuallist.create({
            id:visual_id,
            password:copyData.visual.password,
            category:copyData.visual.category,
            status:copyData.visual.status,
            title:copyData.visual.title,
            isDeleted:0
        });

        // console.log(results);
        return copyData;
    }).then(async (copyData)=>{
        

        let configlist =Config(db.connection,db.Sequelize);
        let results_ = await configlist.create({
            id:id_,
            visual_id:visual_id,
            detail:copyData.config.detail,
            component:copyData.config.component
        });
        console.log(results_);
        return results_
        // res.send(result)
    }).then((resList)=>{
        res.send('复制成功')
    });
});

//新建模板;
app.use('/avue/api/visual/save',async function (req,res,next) {
    console.log('===============================================');
    console.log(req.body);
    console.log('===============================================');


    let req_visual_data = req.body.visual;
    let req_config_data = req.body.config;
    
    let visual_id = utiltool.genID(20);

    // let addsql_0 = 'INSERT INTO blade_visual(id,password,category,status,title) VALUES(?,?,?,?,?)';
    // let addsqlparams_0 = [id,req_visual_data.password,req_visual_data.category,req_visual_data.status,req_visual_data.title];

    let id_ = utiltool.genID(20);


    db.connection.sync({
        force:false
    }).then(async ()=>{
        let visuallist = Visual(db.connection,db.Sequelize);

        let results = await visuallist.create({
            id:visual_id,
            password:req_visual_data.password,
            category:req_visual_data.category,
            status:req_visual_data.status,
            title:req_visual_data.title,
            isDeleted:0
        });

        // console.log(results);
        return results;
    }).then(async (results)=>{
        let configlist = Config(db.connection,db.Sequelize);

        let results_ = await configlist.create({
            id:id_,
            visualId:visual_id,
            detail:req_config_data.detail,
            component:req_config_data.component
        });
        // console.log(results_);
        return {data:{id:visual_id}}
        // res.send(result)
    }).then((resList)=>{
        res.send(resList)
    });
});


//修改模板;
app.use('/avue/api/visual/update',async function (req,res,next) {
    console.log('===============================================');
    console.log(req.body);
    console.log('===============================================');


    let req_visual_data = req.body.visual;
    let req_config_data = (req.body.config==undefined)?null:req.body.config;
    
    // let visual_id = utiltool.genID(20);

    // let addsql_0 = 'INSERT INTO blade_visual(id,password,category,status,title) VALUES(?,?,?,?,?)';
    // let addsqlparams_0 = [id,req_visual_data.password,req_visual_data.category,req_visual_data.status,req_visual_data.title];

    // let id_ = utiltool.genID(20)+1;


    db.connection.sync({
        force:false
    }).then(async ()=>{
        let visuallist = Visual(db.connection,db.Sequelize);

        let results = await visuallist.update({
            password:req_visual_data.password,
            category:req_visual_data.category,
            status:req_visual_data.status,
            title:req_visual_data.title,
            // isDeleted:0
        },{
            where:{
                id:req_visual_data.id,
            }
        });

        console.log(results);
        return results;
    }).then(async (results)=>{
        let results_ = '';

        if(req_config_data){
            
            let configlist = Config(db.connection,db.Sequelize);
            
            results_ = await configlist.update({
                visual_id:req_config_data.visualId,
                detail:req_config_data.detail,
                component:req_config_data.component
            },{
                where:{
                    id:req_config_data.id,
                }
            });
        }

        console.log(results_);
        return {results,results_}

        // res.send(result)
    }).then((resList)=>{
        res.send(resList)
    });
});


//删除模板;
app.use('/avue/api/visual/remove',async function (req,res,next) {
    console.log('===============================================');
    console.log(req.body);
    console.log('===============================================');

    let id = req.query.ids;
    db.connection.sync({
        force:false
    }).then(async ()=>{
        let visuallist = Visual(db.connection,db.Sequelize);

        let results = await visuallist.destroy({
            where:{
                id:id,
            }
        });

        // console.log(results);
        return results;
    }).then(async ()=>{
        let configlist = Config(db.connection,db.Sequelize);

        let results = await configlist.destroy({
            where:{
                visualId:id,
            }
        });

        // console.log(results);
        return results;
    }).then((resList)=>{
        res.send('删除成功')
    });
});




const multer = require('multer')
const upload = multer({dest: __dirname+'/uploads'})

app.use('/avue/api/visual/put-file',upload.single('file'), async (req, res)=>{
    const file = req.file
    file.link = `http://localhost:3000/uploads/${file.filename}`
    res.send({data:file})
});

/*================================地图管理 begin========================================*/


//获取地图列表;
app.get('/avue/api/map/list',function (req,res) {
    
    let page=parseInt((req.query.current==undefined)?0:req.query.current-1);
    let size = parseInt((req.query.current==undefined)?0:req.query.size);
    // let category = (req.query.category==undefined)?1:req.query.category;

    db.connection.sync({
        force:false
    }).then(async ()=>{
        let maplist = Map(db.connection,db.Sequelize);
        let results = await maplist.findAndCountAll({
            offset: (page)*size, limit: size,
            // where: {
            //     category: category
            // }
        });
        console.log(results);
        return {code:200,msg:'success',success:true,data:{records:results.rows,total:results.count,pages:parseInt(results.count/size)+parseInt((results.count%size)>0?1:0),size:size,current:page+1}};
    }).then((result)=>{
        res.send(result)
    });
});


//获取图表请求;
app.post('/avue/api/test/post',function (req,res) {
    req.body.id
    console.log(req.body)
    console.log(req.body.id+'  I am coming!');
    res.send({
        "categories": [
          "苹果02",
        ],
        "series": [{
          "name": "手机品牌01",
          "data": [
            1000879,
          ]
        }]
      });
});

//获取图表请求;
app.get('/avue/api/test/get',function (req,res) {
    req.query.id
    console.log(req.query.id+'  I am coming!');
    res.send({
        "categories": [
          "苹果",
        ],
        "series": [{
          "name": "手机品牌",
          "data": [
            1000879,
          ]
        }]
      });
});

//获取地图详情;
app.get('/avue/api/map/detail',function (req,res) {
    let page=(req.query.current==undefined)?0:req.query.current;
    let size = (req.query.size==undefined)?10:req.query.size;
    // let category = (req.query.category==undefined)?1:req.query.category;
    let id = req.query.id

    db.connection.sync({
        force:false
    }).then(async ()=>{
        let maplist = Map(db.connection,db.Sequelize);
        let results = await maplist.findAll({
            where: {
                id: id
            }
        });
        return results;
    }).then((result)=>{
        // console.log(result)
        res.send({data:result[0]})
    });
});


//获取地图详情;
app.get('/avue/api/map/data',function (req,res) {
    let page=(req.query.current==undefined)?0:req.query.current;
    let size = (req.query.size==undefined)?10:req.query.size;
    // let category = (req.query.category==undefined)?1:req.query.category;
    let id = req.query.id

    db.connection.sync({
        force:false
    }).then(async ()=>{
        let maplist = Map(db.connection,db.Sequelize);
        let results = await maplist.findAll({
            where: {
                id: id
            }
        });
        // console.log(results);
        return results;
    }).then((result)=>{
        // console.log(result);
        res.send(result[0].data)
    });
});


//新建分类;
app.use('/avue/api/map/save',function (req,res) {
    // let page=(req.query.current==undefined)?0:req.query.current;
    // let size = (req.query.size==undefined)?10:req.query.size;
    // let category = (req.query.category==undefined)?1:req.query.category;
    let req_data = req.body
    // Object.assign(req_data)
    db.connection.sync({
        force:false
    }).then(async ()=>{
        let maplist = Map(db.connection,db.Sequelize);
        let results = await maplist.create({
            data:req_data.data,
            name:req_data.name,
            id: utiltool.genID(20),
            // isDeleted: 0
        });
        return results;
    }).then((result)=>{
        // console.log(util.filterUnderLine(result))
        // console.log(result);
        // console.log(utiltool.filterUnderLine(JSON.parse(result)))
        res.send(result)
    });
});



//删除分类;
app.use('/avue/api/map/remove',function (req,res) {
    // let page=(req.query.current==undefined)?0:req.query.current;
    // let size = (req.query.size==undefined)?10:req.query.size;
    // let category = (req.query.category==undefined)?1:req.query.category;
    let req_data = req.body
    // Object.assign(req_data)
    db.connection.sync({
        force:false
    }).then(async ()=>{
        let maplist = Map(db.connection,db.Sequelize);
        let results = await maplist.destroy({
            where:{
                id:req_data.ids
            }
        });
        return results;
    }).then((result)=>{
        // console.log(util.filterUnderLine(result))
        // console.log(result);
        // console.log(utiltool.filterUnderLine(JSON.parse(result)))
        res.send('删除成功')
    });
});


//删除分类;
app.use('/avue/api/map/update',function (req,res) {
    // let page=(req.query.current==undefined)?0:req.query.current;
    // let size = (req.query.size==undefined)?10:req.query.size;
    // let category = (req.query.category==undefined)?1:req.query.category;
    let req_data = req.body
    // Object.assign(req_data)
    db.connection.sync({
        force:false
    }).then(async ()=>{
        let maplist = Map(db.connection,db.Sequelize);
        let results = await maplist.update({
            data:req_data.data,
            name:req_data.name,
        },
        {
            where:{
                id:req_data.id
            }
        });
        return results;
    }).then((result)=>{
        // console.log(util.filterUnderLine(result))
        console.log(result);
        // console.log(utiltool.filterUnderLine(JSON.parse(result)))
        res.send('更新成功')
    });
});

/*================================地图管理 end========================================*/

/*================================分类管理 begin========================================*/


//获取分类列表;
app.get('/avue/api/category/list',function (req,res) {
    
    let page=parseInt((req.query.current==undefined)?0:req.query.current-1);
    let size = parseInt((req.query.size==undefined)?10:req.query.size);
    // let category = (req.query.category==undefined)?1:req.query.category;

    db.connection.sync({
        force:false
    }).then(async ()=>{
        let categorylist = Category(db.connection,db.Sequelize);
        let results = await categorylist.findAndCountAll({
            offset: page*size, limit: size,
            // where: {
            //     category: category
            // }
        });
        // console.log(results);
        return {code:200,msg:'success',success:true,data:results.rows};
    }).then((result)=>{
        res.send(result)
    });
});


//获取分类详情;
app.get('/avue/api/category/detail',function (req,res) {
    let page=(req.query.current==undefined)?0:req.query.current;
    let size = (req.query.size==undefined)?10:req.query.size;
    // let category = (req.query.category==undefined)?1:req.query.category;
    let id = req.query.id

    db.connection.sync({
        force:false
    }).then(async ()=>{
        let categorylist = Category(db.connection,db.Sequelize);
        let results = await categorylist.findAll({
            where: {
                id: id
            }
        });
        return results;
    }).then((result)=>{
        res.send(result)
    });
});




//新建分类;
app.use('/avue/api/category/save',function (req,res) {
    // let page=(req.query.current==undefined)?0:req.query.current;
    // let size = (req.query.size==undefined)?10:req.query.size;
    // let category = (req.query.category==undefined)?1:req.query.category;
    let req_data = req.body
    // Object.assign(req_data)
    db.connection.sync({
        force:false
    }).then(async ()=>{
        let categorylist = Category(db.connection,db.Sequelize);
        let results = await categorylist.create({
            categoryKey:req_data.categoryKey,
            categoryValue:req_data.categoryValue,
            id: utiltool.genID(20),
            isDeleted: 0
        });
        return results;
    }).then((result)=>{
        // console.log(util.filterUnderLine(result))
        // console.log(result);
        // console.log(utiltool.filterUnderLine(JSON.parse(result)))
        res.send(result)
    });
});



//删除分类;
app.use('/avue/api/category/remove',function (req,res) {
    // let page=(req.query.current==undefined)?0:req.query.current;
    // let size = (req.query.size==undefined)?10:req.query.size;
    // let category = (req.query.category==undefined)?1:req.query.category;
    let req_data = req.body
    // Object.assign(req_data)
    db.connection.sync({
        force:false
    }).then(async ()=>{
        let categorylist = Category(db.connection,db.Sequelize);
        let results = await categorylist.destroy({
            where:{
                id:req_data.ids
            }
        });
        return results;
    }).then((result)=>{
        // console.log(util.filterUnderLine(result))
        // console.log(result);
        // console.log(utiltool.filterUnderLine(JSON.parse(result)))
        res.send('删除成功')
    });
});


//删除分类;
app.use('/avue/api/category/update',function (req,res) {
    // let page=(req.query.current==undefined)?0:req.query.current;
    // let size = (req.query.size==undefined)?10:req.query.size;
    // let category = (req.query.category==undefined)?1:req.query.category;
    let req_data = req.body
    // Object.assign(req_data)
    db.connection.sync({
        force:false
    }).then(async ()=>{
        let categorylist = Category(db.connection,db.Sequelize);
        let results = await categorylist.update({
            categoryKey:req_data.categoryKey,
            categoryValue:req_data.categoryValue,
        },
        {
            where:{
                id:req_data.id
            }
        });
        return results;
    }).then((result)=>{
        // console.log(util.filterUnderLine(result))
        console.log(result);
        // console.log(utiltool.filterUnderLine(JSON.parse(result)))
        res.send('更新成功')
    });
});

/*================================分类管理 end========================================*/

// connection.end();
app.listen(3000,function(){   //监听3000端口
    console.log("Server running at 3000 port")
});
