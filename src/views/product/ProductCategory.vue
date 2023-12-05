<template>
  <div>
		<el-form inline>
			<el-form-item >
				<el-input  placeholder="请输入分类名称" v-model="categoryQueryInfo.name" :clearable="true" @clear="searchCategory" @keyup.native.enter="searchCategory" size="small" style="min-width: 500px">
					<el-select  slot="prepend" v-model="brandId" placeholder="请选择分类品牌"  @change="searchBrand()"     style="width: 160px">
						<el-option :label="item.name" :value="item.id"  :key="item.id"   v-for="item in brandList"  ></el-option>
					</el-select>  
					<el-button slot="append" icon="el-icon-search" @click="searchCategory"></el-button>
				</el-input >
			</el-form-item>
			<el-button  type="primary" icon="el-icon-plus" size="small" @click="openProductCategoryVisble">添加品牌分类</el-button>
		</el-form>

		<el-table :data="categoryList">
			<el-table-column label="序号" type="index" width="50"></el-table-column>
			<el-table-column label="id" prop="id" width="50"></el-table-column>
			<el-table-column label="类目" prop="name"  show-overflow-tooltip></el-table-column>
			<el-table-column label="分类图" width="100">
                <template slot-scope="scope">
                    <el-popover placement="right" width="234px" height="160px" trigger="hover" content="....">
                        <div style="width: 380px;height: 200px;"><img style="width: 100%;height: 100%;"
                                :src="scope.row.image" />
                        </div>
                        <div slot="reference" style="width: 65px;height: 36px;"><img style="width: 100%;height: 100%;"
                                :src="scope.row.image" />
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
			<el-table-column label="描述" prop="description" show-overflow-tooltip></el-table-column>
			<el-table-column label="操作" width="300">
				<template v-slot="scope">
					<el-button type="success" icon="el-icon-goods" size="mini" @click="goProduct(scope.row.id)">管理商品</el-button>
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="goEditProductCategory(scope.row.id)">编辑</el-button>
					<el-popconfirm title="确定删除吗？" icon="el-icon-delete" iconColor="red" @onConfirm="deleteProductCategoryById(scope.row.id)">
						<el-button size="mini" type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<!--分页-->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="categoryQueryInfo.pageNum"
		               :page-sizes="[10, 20, 30, 50]" :page-size="categoryQueryInfo.pageSize" :total="total"
		               layout="total, sizes, prev, pager, next, jumper" background>
		</el-pagination>

		      <!--添加标签对话框-->
			  <el-dialog :title="this.visForm.id === ''?'添加品牌下的分类':'修改分类信息'" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cancelVisble">
			<!--内容主体-->
			<el-form :model="visForm"  :rules="formRules" ref="visFormRef" label-width="80px">
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="visForm.name"></el-input>
				</el-form-item>
                <el-form-item label="分类描述" prop="description">
					<el-input v-model="visForm.description"></el-input>
				</el-form-item>
				<el-form-item label="商品图片" prop="image">
                    <el-upload class="avatar-uploader" :action="base + apiUrl" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" :data="type">
                        <img v-if="visForm.image" :src="visForm.image" class="avatar">
                        <i v-else  class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
			</el-form>
			<!--底部-->
			<span slot="footer">
				<el-button @click="cancelVisble">取 消</el-button>
				<el-button type="primary" @click="editProductCategory">确 定</el-button>
			</span>
		</el-dialog>
  </div>
</template>

<script>
	import Breadcrumb from "@/components/Breadcrumb";
	import {getAllProductCategories,updateProductCategory,deleteProductCategory,getProductCategory,addProductCategory} from '@/api/productCategory'
	import {getAllProductBrand} from '@/api/productBrand'

	export default {
		name: "ProductCategory",
		components: {Breadcrumb},
		data() {
			return {
				categoryList: [],
				brandList: [],
				brandId: 1,
				total: 0,
				dialogVisible: false,
				visForm: {
                        id: '',
                        name: '',
                        description: '',
                        image: '',
                        parentId:''
                  },
				categoryQueryInfo: {
					parentId: 1,
					name: '',
					pageNum: 1,
					pageSize: 10
				},
				brandQueryInfo: {
					parentId: -1,
					name: '',
					pageNum: 1,
					pageSize: 10
				},
				formRules: {
                      name: [
                          {required: true, message: '请输入品牌名称', trigger: 'blur'},
                      ],
                      description: [
                          {required: true, message: '请输入品牌描述', trigger: 'blur'},
                      ],
                  },
				//   base: 'http://localhost:8090/admin/',
                //   base:'http://101.201.117.214:8090/admin/',
					base: '/api',
                  apiUrl: '/uploadProductCategoryImage',
				//   本地环境不加/
				//   apiUrl: 'uploadProductCategoryImage',
                  headers: {
                  Authorization: window.localStorage.getItem('token')
                 },
                type: {
                    type: 'productCategoryImage'
                } 
			}
		},
		created() {
			// 查询所有品牌 通过品牌进行搜索查询
			this.getAllProductBrand()
			// 查询当前分类的列表
			this.getAllProductCategories()
		},
		methods: {
			getAllProductCategories() {
				getAllProductCategories(this.categoryQueryInfo).then(res => {
					this.categoryList = res.data.list
					this.total = res.data.total
				})
			},
			getAllProductBrand(){
				getAllProductBrand(this.brandQueryInfo).then(res => {
					this.brandList = res.data.list
				})
			},
			searchCategory() {
				getAllProductCategories(this.categoryQueryInfo).then(res => {
					this.categoryList = res.data.list
					this.total = res.data.total
				})
			},
			searchBrand() {
				this.categoryQueryInfo.parentId = this.brandId
				getAllProductCategories(this.categoryQueryInfo).then(res => {
					this.categoryList = res.data.list
					this.total = res.data.total
				})
			},
			//监听 pageSize 改变事件
			handleSizeChange(newSize) {
				this.categoryQueryInfo.pageSize = newSize
				this.getAllProductCategories()
			},
			//监听页码改变的事件
			handleCurrentChange(newPage) {
				this.categoryQueryInfo.pageNum = newPage
				this.getAllProductCategories()
			},
			goEditProductCategory(id){
				getProductCategory(id).then(res => {
                    this.visForm = res.data
                    this.dialogVisible = true
                })
			},
			editProductCategory(){
				if(this.visForm.id === ''){
					this.$refs.visFormRef.validate(valid => {
					if (valid) {
						this.visForm.parentId = this.brandId
						addProductCategory(this.visForm).then(res => {
							if (res.code === 200) {
								this.msgSuccess(res.msg)
								this.dialogVisible = false
								this.categoryQueryInfo.parentId = this.brandId
								this.getAllProductCategories()
							} else {
								this.msgError(res.msg)
							}
					})
					}
				})
				}else{
					this.$refs.visFormRef.validate(valid => {
					if (valid) {
						updateProductCategory(this.visForm).then(res => {
							if(res.code === 200){
								this.msgSuccess(res.msg)
								this.dialogVisible = false
								this.categoryQueryInfo.parentId = this.brandId
								this.getAllProductCategories()
							}else{
								this.msgError(res.msg)
							}
						})
					}
				})
				}
			},
			deleteProductCategoryById(id) {
				this.$confirm('此操作将<strong style="color: red">永久删除该分类</strong>，是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					dangerouslyUseHTMLString: true
				}).then(() => {
					deleteProductCategory(id).then(res => {
						this.msgSuccess(res.msg)
						this.categoryQueryInfo.parentId = this.brandId
						this.getAllProductCategories()
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			openProductCategoryVisble(){
				this.resetForm()
				this.dialogVisible = true
			},
			cancelVisble(){
				this.dialogVisible = false
				this.resetForm()
				this.$refs.visFormRef.resetFields()
			},
			// 清空表单
			resetForm() {
				this.visForm = {
					id: '',
					name: '',
					description: '',
					image: '',
					parentId:''
				}
			},
			goProduct(id){
				this.$router.push(`/product/product/${id}`)
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
		}
	}
</script>

<style scoped>
	.el-button + span {
		margin-left: 10px;
	}

	.el-form--inline .el-form-item {
		margin-bottom: 0;
	}
	.form--inline .item {
		margin-bottom: 0;
	}
	.from{
		display: block;
  		margin-top: 0em;
	}
	.item{
		display: inline-block;
   		margin-right: 10px;
  	 	vertical-align: top;
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
    width: 234px;
    height: 160px;
    display: block;
}
</style>