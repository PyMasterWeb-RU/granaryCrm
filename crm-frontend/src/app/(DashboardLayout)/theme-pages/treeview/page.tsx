'use client';

import { SvgIconProps } from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
// Базовый TreeView заменяем на SimpleTreeView
import { SimpleTreeView as TreeView } from '@mui/x-tree-view/SimpleTreeView';
import {
  TreeItem,
  TreeItemProps,
  treeItemClasses,
} from '@mui/x-tree-view/TreeItem';
import { useSpring, animated } from 'react-spring';
import { Collapse } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import {
  IconFolderPlus,
  IconFolderMinus,
  IconFolder,
} from '@tabler/icons-react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import ChildCard from '@/app/components/shared/ChildCard';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Treeview' },
];

// Иконки
function MinusSquare(props: SvgIconProps) {
  return <IconFolderMinus style={{ width: 22, height: 22 }} {...props} />;
}
function PlusSquare(props: SvgIconProps) {
  return <IconFolderPlus style={{ width: 22, height: 22 }} {...props} />;
}
function CloseSquare(props: SvgIconProps) {
  return <IconFolder style={{ width: 22, height: 22 }} {...props} />;
}

// Анимация через react-spring + Collapse
function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });
  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

// Стилизованный TreeItem: вместо TransitionComponent пропса используем slot groupTransition
const StyledTreeItem = styled((props: TreeItemProps) => (
  <TreeItem
    {...props}
    // Передаём нашу анимацию через slots.groupTransition
    slots={{ groupTransition: TransitionComponent }}
  />
))(({ theme }) => ({
  // Иконки
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': { opacity: 0.3 },
  },
  // Отступ и бордер для группы
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const Treeview = () => (
  <PageContainer title="Treeview" description="this is Treeview">
    <Breadcrumb title="Treeview" items={BCrumb} />
    <ParentCard title="Treeview">
      <ChildCard>
        <TreeView
          aria-label="customized"
          // Инициализируем открытый узел
          defaultExpandedItems={['1']}
          // Передаём иконки через slots
          slots={{
            collapseIcon: MinusSquare,
            expandIcon:   PlusSquare,
            endIcon:      CloseSquare,
          }}
          sx={{ height: 200, flexGrow: 1, overflowY: 'auto' }}
        >
          {/* У каждого TreeItem — itemId вместо nodeId */}
          <StyledTreeItem itemId="1" label="Main">
            <StyledTreeItem itemId="2" label="Hello" />
            <StyledTreeItem itemId="3" label="Subtree with children">
              <StyledTreeItem itemId="6" label="Hello" />
              <StyledTreeItem itemId="7" label="Sub-subtree with children">
                <StyledTreeItem itemId="9" label="Child 1" />
                <StyledTreeItem itemId="10" label="Child 2" />
                <StyledTreeItem itemId="11" label="Child 3" />
              </StyledTreeItem>
              <StyledTreeItem itemId="8" label="Hello" />
            </StyledTreeItem>
            <StyledTreeItem itemId="4" label="World" />
            <StyledTreeItem itemId="5" label="Something something" />
          </StyledTreeItem>
        </TreeView>
      </ChildCard>
    </ParentCard>
  </PageContainer>
);

export default Treeview;
