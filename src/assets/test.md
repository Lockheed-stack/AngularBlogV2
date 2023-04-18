## Community detection via a triangle and edge combination conductance partitioning

### 1、关于本文
> 以前社区检测的方法:输入矩阵，如邻接矩阵、Laplacian 矩阵，normalized Laplacian 矩阵、模块度矩阵。
> **存在的问题**:只考虑两点之间的关系，即二维的。
> 
> 那我考虑高阶的关系不就好了，比如 3阶张量。如:*(此高阶非彼高阶)*
> > 1. Klymko等人提出了一种基于有向三角形的社区检测方法
> > 2. Benson等人提出用于划分高阶网络结构的张量频谱聚类方法 
> > 3. Lu等人通过设计一个专门针对cliques的新型传导函数(conductance function)，建立了一个社区检测方法。
> 
> **还是存在问题**:还是只考虑了一个单一的关系(模式)。许多网络之间的社区结构是比较复杂的，它并不取决于一个单一的关系。
> 
> **在网络中既存在三段式关系，也存在二段式关系。**
> 那么本文就针对这个问题，提出了一个三角形(triangle)和边(edge)的组合传导(combination conductance)，用于图的划分，以检测社区结构。*(就是把以前矩阵升级为3阶张量，这样就可以考虑多边关系)*


### 2、名词概念

#### Normalized-cut graph partitioning
**前言:** ([参考链接](https://zhuanlan.zhihu.com/p/266604288))
> ==cut 与 conductance==
> * 图割(cut)，就是将顶点集分成两个不相交的子集，即 $A\cup B=V,A\cap B=\emptyset$ 。
>   最小割（min cut），将图分成两个不相交的部分，且代价最小(比如删去边的权重之和最小)。这不就很类似于分类(聚类)问题吗？
> 
> * 而对于图的聚类，最简单的方法，就是分出 k 个不相交顶点集，使顶点集之间的边的权重之和最小。
>   但最小割的方法并不适合聚类，虽然分类所需的权值最小，但结果并不好，比如:
>   ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/3371043e56baaab8210e2353fd495add_2020060919370289.png)
>   它将离大部队过远的单个顶点与其他顶点分开，形成两类。**所以**，不仅要让割边的权和最小，还要让这 k 个顶点集都差不多大。
> 
> * 因此在最小割的基础上，出现了 *Normalized Cut* 。思路简单，即字面意思，将 “割归一化”，除以表现顶点集大小的**某种度量volume**，如 vol(A) = 所有A中顶点的度之和。
> * 那 Conductance 是什么？与min cut 逻辑不同，Conductance 不仅仅考虑分组之间的连接，也考虑了分割**组内**的“体积块”，保证分割后得到的块更均衡，Conductance指标定义如下:
>   $$\phi(A,B)=\frac{\text{cut}(A,B)}{\min(vol(A),vol(B))}$$
>   
>  ==spectral==
>  给定图 G，邻接矩阵 A 。设 x 为 n 维向量 $(x_1,x_2,...,x_n)$ , 我们认为这是图中每个节点的一种标签，那么 $A*x$ 的意义如下:
>  ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/cdca8c9b4583b2666e9b99b9b53ce16a_v2-732996cd70fd7af87a022e8b1fcfe4ee_720w.webp)
>  $y_i$ 为节点 i 的邻居的标签和。
>  自然而然就感觉和它有关:$Ax=\lambda x$ 。那么就可求得 $\lambda_i$ 和对应的特征向量 $x_i$ 。
>  对于图 G ，spectral 定义为对应的特征值 $\lambda_1,\lambda_2,...\lambda_n$ ，其 $\lambda_1\le \lambda_2 \le ... \le \lambda_n$ 对应特征向量 $x_1,x_2,...x_n$ 。
>  
>  ==相似度图==
>  相似图是什么？其实谱聚类只是用到了图的相关知识，图中的每个点可能代表某种东西，但所给的数据只有点的信息，因此需要构建相似度矩阵。相似度矩阵一般就是指**邻接矩阵**。
>  
>  要衡量各个顶点之间的相似度，主要基于距离的度量，并可生成对应的*相似度矩阵*。以下是 3 种常见的衡量方法:
>  1. $\epsilon$ 近邻法
> >
> >  采用欧氏距离计算两个点之间的距离，然后设定一个阈值 $\epsilon$ ,使得:
>>
>>	$$
> >    w_{ij}=
> >    \begin{cases}
> >    0&, \text{ if } s_{ij}>\epsilon \\\\
> >    \epsilon &, \text{ if } s_{ij}\le \epsilon
> >    \end{cases}
> >   $$
> >    
> >    由此得到的相似度矩阵元素要么是0，要么是 $\epsilon$ ,获取权重的信息太少，不常用。
>  2. k-近邻法
>  >   原理是当预测一个新的值 x 时，根据它距离最近的 k 个点是什么类别，来判断 x 属于哪个类别。k值不同，判定的结果也会不同。因此主要就是 k 值的选取和点距离的计算。
>  >   **存在一个问题**:最后得到的相似度矩阵不一定是对称的。点 $v_i$ 在另一个点 $v_j$ 的 k 个近邻中，但 $v_j$ 不一定在 $v_i$ 的 k 个近邻中。
>  >   解决方法:
>  >   * "或" 的方法:只要 $v_i,v_j$ 其中一个点在另外一个点的 k 个近邻中，则令 $w_{ij}=w_{ji}$ ,否则 $w_{ij}=w_{ji}=0$ 。
>  >   * "与" 的方法:如果 $v_i$ 是 $v_j$ 的 k 近邻，并且 $v_j$ 是 $v_i$ 的 k 近邻，则令 $w_{ij}=w_{ji}$ ,否则 $w_{ij}=w_{ji}=0$ 。
>  3. 全连接法
>     将所有的点都连接起来，然后用某种相似度函数进行评价，如高斯核函数。

**引出**

> 基于 normalized-cut graph partitioning 的谱聚类.
> 
> 令 $G=(V_G,E_G)$ 为无向图; 
> 
> 邻接矩阵 $A=(a_{ij})_{n\times n}$; 
> 
> 度对角矩阵 $D=\text{diag}(d_1,d_2,...,d_n)$; 
> 
> 拉普拉斯矩阵 L = D-A 。
> 
> 对于一个集合 $S\subsetneq V_G$ , 其补集 $\bar{S}=V_G-S$  。容量(volume) $vol(S)=\sum\limits_{i\in S} d_i$ ，表示集合 S 中所有点的度之和。则在图 G 中 S 的割(cut) 的大小为:
> 
> $$
> \text{cut}(S,\bar{S})=\frac{1}{2}\sum\limits_{i,j \text{ in different subsets}}a_{ij} \tag{1}
> $$
> 
> 设x是顶点集S的一个指标向量,其中:
> 
> $$
> x_i = 
> \begin{cases}
> +1 &, \text{ if } i\in S \\\\
> -1 &,\text{ if } i\in \bar{S}
> \end{cases}
> $$
> 
> 因此，如果 i,j 在同一个集合中($S\text{ or } \bar{S}$)，则 $\frac{1}{2}(1-x_i x_j)=0$ ;否则 $\frac{1}{2}(1-x_i x_j)=1$. 那么公式(1)可写成:
> 
> $$
> \text{cut}(S,\bar{S})=\frac{1}{4} \sum\limits_{i,j=1}^n a_{ij}(1-x_i x_j)
> $$
> 
> 由于 $x_i^2=1$，则 $\sum\limits_{i,j=1}^n a_{ij}(1-x_i x_j)=\frac{1}{2}\sum\limits_{i,j=1}^n a_{ij}(x_i^2 -2 x_i x_j+x_j^2)$ ，因此割的大小可写为:
> 
> $$
> \text{cut}(S,\bar{S})=\frac{1}{4} x^T Lx
> $$
> 
> 图 G 的 conductance 为:
> 
> $$\phi(G)=\min\limits_{S\subsetneq V_G} \frac{\text{cut}(S,\bar{S})}{\min\set{vol(S),vol(\bar{S})}}$$
> 则此时可近似为:
> 
> $$\text{minimize } \frac{x^T Lx}{x^T Dx} \text{ and } e^TDx=0$$
> 
> 其中 e 是全 1 的向量。

#### Triangle cut size

> 使用了 3 阶张量。
> 对于一个 3 阶张量  $\mathcal{T}=(t_{ijk})\in \mathbb{R}^{n\times n \times n}$ ，与一个实向量 $x=(x_1,x_2,...,x_n)^T$, 
> 则 $\mathcal{T}x^2$ 为 一个 **n 维向量**，其中第 i 个元素为:
> 
> $$ \lparen\mathcal{T}x^2\rparen_i= \sum\limits_{j,k=1}^n t_{ijk} x_j x_k$$
> 
> $x^T\mathcal{T}$ 为 2 阶张量，即**矩阵**，对应元素为:
> 
> $$\lparen x^T \mathcal{T} \rparen_{jk}=\sum\limits_{i=1}^n x_i t_{ijk}$$
> 
> 向量 $y^T=(y_i)^T$ 与 $\mathcal{T}x^2$ 的乘积为:*（一个值）*
> 
> $$y^T\mathcal{T}x^2 = \sum\limits_{i,j,k=1}^n t_{ijk} y_i x_j x_k$$
> 
> 

以上是 3 阶张量的一些运算。结合这些运算，与之前的 normalized cut 相关的知识，可引出下面一些内容:
> 令 3 阶对称张量 $\mathcal{A}=(a_{ijk})\in \mathbb{R}^{n\times n \times n}$ ，表示图中的三角关系(triadic relation)，其中:
> 
> $$
> a_{ijk}=
> \begin{cases}
> \frac{1}{2}&, \text{ if \{i,j,k\} form a triangle,} \\\\
> 0&, \text{ otherwise}
> \end{cases}
> $$
> 
> 称 $\mathcal{A}$ 为 **邻接张量** 。
> 令 $\mathcal{D}$ 为 3 阶 n 维 **对角张量**，对角元素为 $d_{iii}=\sum\limits_{j,k=1}^n a_{ijk}$ ，其余元素为0 。那么 $\mathcal{L}=\mathcal{D}-\mathcal{A}$ 就是**拉普拉斯张量** 。
> 
> 沿用之前 cut 的大体框架并做点变化:
> 
> $$
> \text{cut}_\Delta(S,\bar{S}) = \frac{1}{3} \sum\limits_{\text{i,j and k not in the same set}}a_{ijk}
> $$
> 
> $\frac{1}{3}$ 这系数是因为对每个三角形计算了 6 次。
> 
> 同样有:
> 
> $$
> x_i = 
> \begin{cases}
> +1&, \text{ if } i\in S \\\\
> -1&,\text{ if } i\in \bar{S}
> \end{cases}
> $$
> 
> 此时:
> 
> $$
> \frac{1}{4}(3-x_i x_j-x_i x_k - x_j x_k)=
> \begin{cases}
> 0&, \text{ if i,j,k are in the same } S \text{ or } \bar{S} \\\\
> 1&, \text{ otherwise}
> \end{cases}
> $$
> 
> 那么就有第一步进化:
> 
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221021165027.png)
> 又有
> 
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221021171303.png)
> 
> e 为全 1 向量。则可再进化为:
> 
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221021171457.png)
> 
> 再将向量 x 映射为指标向量 z，即 $z_i=1 \text{ if } x_i=1 \text{ and } z_i=0 \text{ if } x_i=-1$。
> 就有 $\sum\limits_{ij}(x_i-x_j)^2=4\sum\limits_{ij}(z_i-z_j)^2$ 。
> 最终有:
> 
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221021173308.png)
> 

#### Triangle and edge combination conductance
> 概念也是承接 conductance ，只是换成了张量相关的。
> 
> 令 $\text{vol}_\Delta(S)$ 为包含 S 中顶点的三角形数量之和，即:
> 
> 
> $$
> \text{vol}_\Delta (S) =\sum\limits_{i\in S} d_{iii}=e^T\mathcal{D}z^2
> $$
> 
> 
> 定义一个新的图 G 的 conductance cut:
> 
> 
> $$
> \tilde{\phi}(G) = \min\limits_{S\subsetneq V_G} \frac{\text{cut}_C(S,\bar{S})}{\min(\text{vol}_C(S),\text{vol}_C(\bar{S}))}
> $$
> 
> 
> 其中:
> 
> $$
> \begin{aligned}
> \text{cut}_C(S,\bar{S}) &= (1-\alpha) \text{cut}_\Delta(S,\bar{S})+\alpha \text{cut}(S,\bar{S}) \\\\
> \text{vol}_C(S) &= (1-\alpha) \text{vol}_\Delta(S)+\alpha \text{vol}(S)\\\\
> &0<\alpha<1 \text{ is a constant}
> \end{aligned}
> $$
> 
> 之后:
> 
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221021203752.png)
> 

### 3、算法
> 
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221021210316.png)
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221021210236.png)
> 时间复杂度分析:
> 计算 3 阶张量为 $O(n^3)$ 
> 算法3.1 计算第二小特征向量为 $O(n^2)$ ;排序第二小的特征向量的 indices（元素？）为 $O(n\log n)$  。
> 算法3.2 计算前 k 个最小特征向量为$O(n^3)$ ;k-means 算法为 $O(nk^2h)$，h 为迭代次数。
> 总之，不太适合大规模网络。
> 

### 4、实验
> 评价方法:NMI，模块度。
> * 在 GN 网络上:
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221022203731.png)
> $z_{out}$ 越大,社区的结构变得越模糊,越难检测。
> $z_{out}\le 6$ 时，效果还行。$z_{out}\ge 9$ 时，基本上接近0了。
> 
> * LFR网络:
> 人工生成的网络，可调整社区重叠程度，重叠越高，越难检测。
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221022205857.png)
> 研究了一下不同参数对检测结果的影响。
> 
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221022210021.png)
> 与其它方法的比较。
> 
> * 随机网络
> 节点的连接概率相互独立，导致网络中链接密度比较均匀，预计不应该有社区。(社区越少越好)
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221022211158.png)
> 
> * Football
> 只有少数顶点被划分错误，NMI=0.9242
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221022211325.png)
> 
> * ScienceNet
> NMI=0.9362
> ![](https://cdn.jsdelivr.net/gh/Lockheed-stack/new_img_repo@main/Pasted%20image%2020221022212155.png)
> 