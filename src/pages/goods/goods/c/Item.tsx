import React, { Component } from 'react'
import { Card, Icon, Popconfirm } from 'antd'
const { Meta } = Card

import './Item.style.less'
import Goods from '../../../../class/Goods'
import { SPEC_TYPE_BASE, SPEC_TYPE_MODIFY } from '../../../../class/goodsTypes'

interface ItemProps {
  isSelected?: boolean
  data: Goods
  onEditClick(goods: Goods): void
  onDeleteClick(goods: Goods): void
}

const DEFAULT_IMG_URL =
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539053797&di=6cf97cb3dbdb85da447b75c1f2aef921&imgtype=jpg&er=1&src=http%3A%2F%2Fpic40.photophoto.cn%2F20160807%2F1155115790822404_b.jpg'

export default class Item extends Component<ItemProps, any> {
  private getPrice = (): string => {
    const goods = this.props.data
    const { spec, price } = goods

    if (spec.length > 0) {
      let minPrice = undefined
      spec.map(item => {
        item.subSpecs.map(subItem => {
          if (
            subItem.type === SPEC_TYPE_BASE &&
            (!minPrice || (isNaN(minPrice) && subItem.price < minPrice))
          ) {
            minPrice = subItem.price
          }
        })
      })
      let minFixPrice = undefined
      spec.map(item => {
        item.subSpecs.map(subItem => {
          if (
            subItem.type === SPEC_TYPE_MODIFY &&
            (!minFixPrice ||
              (isNaN(minFixPrice) && subItem.price < minFixPrice))
          ) {
            minFixPrice = subItem.price
          }
        })
      })

      if (!minPrice) minPrice = 0
      if (!minFixPrice) minFixPrice = 0
      return `${minPrice + minFixPrice}元起`
    } else {
      return `${price}元`
    }
  }

  render() {
    const { onEditClick, onDeleteClick } = this.props
    const goods = this.props.data

    return (
      <div className={this.props.isSelected ? 'selected-bg' : null}>
        <Card
          style={{ width: 240, margin: 16 }}
          cover={
            <img
              className="goods-img"
              draggable={false}
              alt="example"
              src={goods.mainImage ? goods.mainImage.url : DEFAULT_IMG_URL}
            />
          }
          actions={[
            <Icon type="setting" />,
            <Icon type="edit" onClick={() => onEditClick(goods)} />,
            <Popconfirm
              title="您确定要删除该商品吗？"
              onConfirm={()=>{onDeleteClick(goods)}}
              okText="确定"
              cancelText="取消"
            >
              <Icon type="delete"/>
            </Popconfirm>
          ]}
        >
          <Meta title={goods.title} />
          {goods.spec.map((item, index) => {
            let subSpecsText = ''
            item.subSpecs.map(subItem => {
              subSpecsText += subItem.name + '/'
            })
            subSpecsText = subSpecsText.substring(0, subSpecsText.length - 1)
            return (
              <Meta key={index} description={`${item.name}: ${subSpecsText}`} />
            )
          })}
          <Meta title={this.getPrice()} />
        </Card>
      </div>
    )
  }
}
