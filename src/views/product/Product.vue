<template>
    <div>
        <el-form inline>
            <el-form-item>
                <el-input placeholder="请输入商品名称" v-model="queryInfo.name" :clearable="true" @clear="search"
                    @keyup.native.enter="search" size="small" style="min-width: 400px">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </el-form-item>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="openProductVisble">添加商品</el-button>
        </el-form>

        <el-table :data="productList">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="id" prop="id" width="50"></el-table-column>
            <el-table-column label="商品名称" prop="name" show-overflow-tooltip></el-table-column>
            <!-- http://101.201.117.214/image/product/12/6.webp -->
            <!-- <el-table-column label="商品图" width="100">
                <template slot-scope="scope">
                  <el-popover placement="right" width="360px" height="200px" trigger="hover" content="....">
                    <div style="width: 380px;height: 200px;"><img style="width: 100%;height: 100%;"
                        src="http://101.201.117.214/image/product/12/6.webp" />
                    </div>
                   <div slot="reference" style="width: 65px;height: 36px;"><img style="width: 100%;height: 100%;"
                     src="http://101.201.117.214/image/product/12/6.webp" />
                    </div>
                </el-popover>
               </template>
             </el-table-column> -->
            <el-table-column label="商品图" width="100">
                <template slot-scope="scope">
                    <el-popover placement="right" width="360px" height="200px" trigger="hover" content="....">
                        <div style="width: 380px;height: 200px;"><img style="width: 100%;height: 100%;"
                                :src="scope.row.image" />
                        </div>
                        <div slot="reference" style="width: 65px;height: 36px;"><img style="width: 100%;height: 100%;"
                                :src="scope.row.image" />
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="商品货号" prop="code" show-overflow-tooltip></el-table-column>
            <el-table-column label="商品配色" prop="color" show-overflow-tooltip></el-table-column>
            <el-table-column label="发售价" prop="retail" show-overflow-tooltip></el-table-column>
            <el-table-column label="限购数量" prop="purchaseRestrictions" show-overflow-tooltip></el-table-column>
            <el-table-column label="商品描述" prop="description" show-overflow-tooltip></el-table-column>
            <el-table-column label="是否推荐" width="100" prop="recommend">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.recommend" 
                                @change="changeRecommend(scope.row.id, scope.row.recommend)">
                            </el-switch>
                        </template>
			    </el-table-column>
            <el-table-column label="操作" width="300">
                <template v-slot="scope">
                    <el-button type="success" icon="el-icon-sell" size="mini" @click="goProductInventoryInfo(scope.row.id)">管理库存</el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                        @click="goEditProduct(scope.row.id)">编辑</el-button>
                    <el-popconfirm title="确定删除吗？" icon="el-icon-delete" iconColor="red"
                        @onConfirm="deleteProduct(scope.row.id)">
                        <el-button size="mini" type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum" :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pageSize" :total="total"
            layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
        <!--添加标签对话框-->
        <el-dialog :title="this.visForm.id === '' ? '添加商品' : '修改商品信息'" width="50%" :visible.sync="dialogVisible"
            :close-on-click-modal="false" @close="cancelVisble">
            <!--内容主体-->
            <el-form :model="visForm" :rules="formRules" ref="visFormRef" label-width="80px">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="visForm.name"></el-input>
                </el-form-item>
                <el-form-item label="商品图片" prop="image">
                    <el-upload class="avatar-uploader" :action="base + apiUrl" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers">
                        <img v-if="visForm.image" :src="visForm.image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品货号" prop="code">
                    <el-input v-model="visForm.code"></el-input>
                </el-form-item>
                <el-form-item label="商品配色" prop="color">
                    <el-input v-model="visForm.color"></el-input>
                </el-form-item>
                <el-form-item label="发售价" prop="retail">
                    <el-input v-model="visForm.retail"></el-input>
                </el-form-item>
                <el-form-item label="限购数量" prop="purchaseRestrictions">
                    <el-input v-model="visForm.purchaseRestrictions"></el-input>
                </el-form-item>
                <el-form-item label="商品描述" prop="description">
                    <el-input type="textarea" v-model="visForm.description"></el-input>
                </el-form-item>
                <el-form-item label="发售时间" prop="createTime">
                    <div class="block">
                        <el-date-picker v-model="visForm.createTime" type="datetime" placeholder="选择发售时间"
                            default-time="00:00:00">
                        </el-date-picker>
                    </div>
                </el-form-item>

            </el-form>
            <!--底部-->
            <span slot="footer">
                <el-button @click="cancelVisble">取 消</el-button>
                <el-button type="primary" @click="editProduct">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getAllProduct, addProduct, updateProduct, getProduct, deleteProduct,changeRecommend } from '@/api/product'
import {checkNumber} from "@/util/reg";

export default {
    name: 'ProductInfo',
    data() {
        return {
            productList: [],
            total: 0,
            dialogVisible: false,
            visForm: {
                id: '',
                name: '',
                code: '',
                color: '',
                retail: '',
                purchaseRestrictions: '',
                description: '',
                image: '',
                productCategoryId: '',
                createTime: '',
            },
            queryInfo: {
                productCategoryId: '',
                name: '',
                pageNum: 1,
                pageSize: 10
            },
            formRules: {
                name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                code: [
                    { required: true, message: '请输入商品货号', trigger: 'blur' },
                ],
                color: [
                    { required: true, message: '请输入品牌配色', trigger: 'blur' },
                ],
                retail: [
                    { required: true, message: '请输入发售价', trigger: 'blur' },
                ],
                purchaseRestrictions: [
                    { required: true, message: '请输入限购数量', trigger: 'blur' },
                    {validator: checkNumber, trigger: 'blur'}
                ],
                description: [
                    { required: true, message: '请输入品牌描述', trigger: 'blur' },
                ],
                createTime: [
                    { required: true, message: '请输入商品发售时间', trigger: 'blur' },
                ],
            },
            // base: 'http://localhost:8090/admin/',
            // base:'http://101.201.117.214:8090/admin/',
            // 服务器环境
            base: '/api',
            apiUrl: '/uploadProductImage',
            // 本地环境 不加/
            // apiUrl: 'uploadProductImage', 
            headers: {
                Authorization: window.localStorage.getItem('token')
            },
        }
    },
    computed: {
        productCategoryId() {
            return parseInt(this.$route.params.id)
        }
    },
    created() {
        this.getAllProduct()
    },
    methods: {
        getAllProduct() {
            this.queryInfo.productCategoryId = this.productCategoryId
            getAllProduct(this.queryInfo).then(res => {
                console.log(res.data)
                this.productList = res.data.list
                this.total = res.data.total
            })
        },
        search() {
            this.queryInfo.pageNum = 1
            this.queryInfo.pageSize = 10
            this.getAllProduct()
        },
        //监听 pageSize 改变事件
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize
            this.getAllProduct()
        },
        //监听页码改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage
            this.getAllProduct()
        },
        goEditProduct(id) {
            const productId = id
            getProduct(productId).then(res => {
                this.visForm.image = res.data.image
                this.visForm = res.data
                this.dialogVisible = true
            })
        },
        editProduct() {
            if (this.visForm.id === '') {
                this.$refs.visFormRef.validate((valid) => {
                    if (valid) {
                        this.visForm.productCategoryId = this.productCategoryId
                        addProduct(this.visForm).then(res => {
                            this.msgSuccess(res.msg)
                            this.cancelVisble()
                            this.getAllProduct()
                        })
                    } else {
                        this.msgError('表单验证失败')
                        return false
                    }
                })
            } else {
                this.$refs.visFormRef.validate((valid) => {
                    if (valid) {
                        updateProduct(this.visForm).then(res => {
                            this.msgSuccess(res.msg)
                            this.cancelVisble()
                            this.getAllProduct()
                        })
                    } else {
                        this.msgError('表单验证失败')
                        return false
                    }
                })
            }
        },
        deleteProduct(id) {
            this.$confirm('此操作将<strong style="color: red">永久删除该商品</strong>，是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true
            }).then(() => {
                const productId = id
                deleteProduct(productId).then(res => {
                    if (res.code === 200) {
                        this.msgSuccess(res.msg)
                    this.getAllProduct()
                    } else {
                        this.msgError(res.msg)
                    }
          
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        openProductVisble() {
            this.resetForm()
            this.dialogVisible = true
        },
        cancelVisble() {
            this.dialogVisible = false
            this.resetForm()
            this.$refs.visFormRef.resetFields()
        },
        // 清空表单
        resetForm() {
            this.visForm = {
                id: '',
                name: '',
                code: '',
                color: '',
                retail: '',
                purchaseRestrictions: '',
                description: '',
                image: '',
                productCategoryId: ''
            }
        },
        handleAvatarSuccess(res, file) {
            if (res.code === 200) {
                this.visForm.image = URL.createObjectURL(file.raw);
                this.visForm.image = res.data
                console.log(this.visForm.image)
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isWebp = file.type === 'image/webp';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG && !isWebp) {
                this.$message.error('上传头像图片格式错误!');
                return false;
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                return false;
            }
        },
        changeRecommend(id, recommend){
            const checked = recommend 
                changeRecommend(id,checked).then(res=>{
                this.msgSuccess(res.msg)
                this.getAllProduct()
            })
        },
        goProductInventoryInfo(id){
            this.$router.push(`/inventory/ProductInventoryInfo/${id}`)
        },
    }

}
</script>

<style scoped>
.el-button+span {
    margin-left: 10px;
}

.el-form--inline .el-form-item {
    margin-bottom: 0;
}

.avatar-uploader /deep/.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 280px;
    height: 150px;
    display: block;
}
</style>